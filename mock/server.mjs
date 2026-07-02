/**
 * @fileoverview 本地 Mock API Server
 * @description 基于 Express 的轻量 Mock 服务，替代不稳定的第三方 API
 * 启动后访问 http://localhost:3000
 */

import { Buffer } from 'node:buffer'
import express from 'express'
import cors from 'cors'
import Busboy from 'busboy'

const app = express()

/** 上传文件存储：key=路径，value=Buffer */
const fileStore = new Map()
let fileSeq = 1

/**
 * 用 busboy 解析 multipart/form-data。
 * Express 5 中 req 流可能已被内部处理，用 express.raw() 先把 body 抓成 Buffer
 * 再喂给 busboy，最可靠。
 */
function parseFormFields(req) {
  return new Promise((resolve, reject) => {
    const raw = req.body instanceof Buffer ? req.body : Buffer.from(req.body || '')
    const fields = {}
    const bb = Busboy({ headers: req.headers })
    bb.on('field', (name, val) => { fields[name] = val })
    bb.on('file', (name, stream, info) => {
      const fileChunks = []
      stream.on('data', (d) => fileChunks.push(d))
      stream.on('end', () => {
        const ext = info.filename ? '.' + info.filename.split('.').pop() : '.png'
        const path = '/images/upload_' + (fileSeq++) + ext
        fileStore.set(path, Buffer.concat(fileChunks))
        fields[name] = path
      })
    })
    bb.on('finish', () => resolve(fields))
    bb.on('error', reject)
    bb.end(raw)
  })
}

app.use(cors())
// express.raw() 捕获所有请求的 body 为 Buffer；JSON 路由手动 parse，multipart 路由交给 busboy
app.use(express.raw({ type: 'multipart/form-data' }))
app.use(express.json({ limit: '5mb' }))

// 最小有效 PNG（1x1 像素），用作占位封面图
const PLACEHOLDER_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  'base64'
)

// 封面图占位端点（Mock 中所有 /images/* 返回同一张占位图）
app.get('/images/:file', (req, res) => {
  const path = '/images/' + req.params.file
  const stored = fileStore.get(path)
  if (stored) {
    const ext = path.split('.').pop().toLowerCase()
    const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg'
      : ext === 'gif' ? 'image/gif'
      : ext === 'webp' ? 'image/webp'
      : 'image/png'
    return res.type(mime).send(stored)
  }
  res.type('png').send(PLACEHOLDER_PNG)
})

// ─── 内存数据库 ─────────────────────────────────────────

/** Token → username 映射（模拟 JWT 会话） */
const tokens = new Map()

/** 从请求头提取当前登录用户名 */
function getCurrentUser(req) {
  const auth = req.headers.authorization
  return auth ? tokens.get(auth.replace(/^Bearer /, '')) : null
}

const user = {
  id: 1,
  username: 'admin',
  nickname: '管理员',
  email: 'admin@bigevent.com',
  user_pic: null
}

// ─── RBAC 角色与权限 ────────────────────────────────────

/** 可用权限码全量列表 */
const ALL_PERMISSIONS = [
  { code: 'article:read', label: '查看文章', group: 'article' },
  { code: 'article:create', label: '发布/编辑文章', group: 'article' },
  { code: 'article:delete', label: '删除文章', group: 'article' },
  { code: 'channel:read', label: '查看分类', group: 'channel' },
  { code: 'channel:manage', label: '管理分类', group: 'channel' },
  { code: 'user:profile', label: '个人中心', group: 'user' },
  { code: 'role:manage', label: '角色管理', group: 'role' }
]

/** 预设角色 */
const ROLES = [
  {
    id: 1,
    name: 'admin',
    label: '管理员',
    description: '超级管理员，拥有所有权限',
    permissions: ['*']
  },
  {
    id: 2,
    name: 'editor',
    label: '编辑者',
    description: '管理文章内容，查看分类',
    permissions: [
      'article:read',
      'article:create',
      'article:delete',
      'channel:read'
    ]
  },
  {
    id: 3,
    name: 'viewer',
    label: '访客',
    description: '只读访问',
    permissions: ['article:read', 'channel:read', 'user:profile']
  }
]
let roleSeq = 4

/** username → 角色名列表 */
const userRoles = new Map([
  ['admin', ['admin']],
  ['editor', ['editor']],
  ['viewer', ['viewer']]
])

/** 展开角色权限为平铺数组（支持 * 通配符） */
function expandPermissions(roleNames) {
  const set = new Set()
  for (const name of roleNames) {
    const role = ROLES.find((r) => r.name === name)
    if (!role) continue
    for (const perm of role.permissions) {
      if (perm === '*') {
        ALL_PERMISSIONS.forEach((p) => set.add(p.code))
      } else if (perm.endsWith(':*')) {
        const prefix = perm.slice(0, -1)
        ALL_PERMISSIONS.forEach((p) => {
          if (p.code.startsWith(prefix)) set.add(p.code)
        })
      } else {
        set.add(perm)
      }
    }
  }
  return [...set]
}

/** 从 token 获取用户权限 */
function getUserPermissions(req) {
  const username = getCurrentUser(req)
  if (!username) return []
  return expandPermissions(userRoles.get(username) || [])
}

/** 权限校验中间件工厂 */
function requirePermission(permission) {
  return (req, res, next) => {
    const perms = getUserPermissions(req)
    if (!perms.length) {
      return res.status(401).json({ code: 1, message: '未授权', data: null })
    }
    if (!perms.includes(permission)) {
      return res
        .status(403)
        .json({ code: 1, message: '无权限执行此操作', data: null })
    }
    next()
  }
}

const categories = [
  { id: 1, cate_name: '技术', cate_alias: 'tech' },
  { id: 2, cate_name: '生活', cate_alias: 'life' },
  { id: 3, cate_name: '旅行', cate_alias: 'travel' }
]
let categorySeq = 4

const articles = [
  {
    id: 1,
    title: 'Vue 3 组合式 API 入门',
    content: '<p>Vue 3 的 Composition API 提供了更灵活的逻辑复用方式...</p>',
    cover_img: '/images/vue3.png',
    state: '已发布',
    cate_id: 1,
    cate_name: '技术',
    pub_date: '2026-06-15T10:30:00.000Z'
  },
  {
    id: 2,
    title: '我的周末早餐',
    content: '<p>一份健康的早餐从一杯手冲咖啡开始...</p>',
    cover_img: '/images/breakfast.png',
    state: '已发布',
    cate_id: 2,
    cate_name: '生活',
    pub_date: '2026-06-20T08:00:00.000Z'
  },
  {
    id: 3,
    title: '北海道旅行攻略',
    content: '<p>冬季的北海道是一幅银白色的画卷...</p>',
    cover_img: '/images/hokkaido.png',
    state: '草稿',
    cate_id: 3,
    cate_name: '旅行',
    pub_date: '2026-07-01T20:15:00.000Z'
  }
]
let articleSeq = 4

// ─── 工具函数 ─────────────────────────────────────────

/** 统一成功响应 */
const ok = (data = null, message = 'success') => ({ code: 0, message, data })

// ─── 用户模块 ─────────────────────────────────────────

/** 已注册用户：username → password */
const users = new Map([
  ['admin', '123456'],
  ['editor', '123456'],
  ['viewer', '123456']
])

/** POST /api/reg — 注册 */
app.post('/api/reg', (req, res) => {
  const { username, password } = req.body
  if (!username || !password) {
    return res.json({ code: 1, message: '用户名或密码不能为空', data: null })
  }
  if (users.has(username)) {
    return res.json({ code: 1, message: '用户名已被占用', data: null })
  }
  users.set(username, password)
  res.json(ok(null, '注册成功'))
})

/** POST /api/login — 登录 */
app.post('/api/login', (req, res) => {
  const { username, password } = req.body
  if (!username || !password) {
    return res.json({ code: 1, message: '用户名或密码不能为空', data: null })
  }
  if (users.get(username) !== password) {
    return res.json({ code: 1, message: '用户名或密码错误', data: null })
  }
  // 每次登录生成独立 Token，绑定用户名
  const token = 'token_' + username + '_' + Date.now()
  tokens.set(token, username)
  res.json(ok({ token }, '登录成功'))
})

/** GET /my/userinfo — 获取用户信息（含角色与权限） */
app.get('/my/userinfo', (req, res) => {
  const username = getCurrentUser(req)
  if (!username) {
    return res.status(401).json({ code: 1, message: '未授权', data: null })
  }
  const roles = userRoles.get(username) || ['viewer']
  const permissions = expandPermissions(roles)
  res.json(ok({ ...user, username, role: roles[0], permissions }))
})

/** PUT /my/userinfo — 更新用户信息 */
app.put('/my/userinfo', (req, res) => {
  const { nickname, email } = req.body
  if (nickname) user.nickname = nickname
  if (email) user.email = email
  res.json(ok(null, '修改成功'))
})

/** PATCH /my/update/avatar — 更新头像 */
app.patch('/my/update/avatar', (req, res) => {
  user.user_pic = req.body.avatar || null
  res.json(ok(null, '头像更新成功'))
})

/** PATCH /my/updatepwd — 修改密码 */
app.patch('/my/updatepwd', (req, res) => {
  const username = getCurrentUser(req)
  if (!username) {
    return res.status(401).json({ code: 1, message: '未授权', data: null })
  }
  const { old_pwd, new_pwd } = req.body
  if (!old_pwd || !new_pwd) {
    return res.json({ code: 1, message: '密码不能为空', data: null })
  }
  if (users.get(username) !== old_pwd) {
    return res.json({ code: 1, message: '原密码错误', data: null })
  }
  users.set(username, new_pwd)
  // 密码已变，清除旧 Token 强制重新登录
  tokens.forEach((u, t) => { if (u === username) tokens.delete(t) })
  res.json(ok(null, '密码修改成功'))
})

// ─── 文章分类模块 ─────────────────────────────────────

/** GET /my/cate/list — 获取分类列表 */
app.get('/my/cate/list', (_req, res) => {
  res.json(ok(categories))
})

/** POST /my/cate/add — 添加分类 */
app.post('/my/cate/add', (req, res) => {
  const { cate_name, cate_alias } = req.body
  const newCate = { id: categorySeq++, cate_name, cate_alias }
  categories.push(newCate)
  res.json(ok(null, '添加成功'))
})

/** PUT /my/cate/info — 编辑分类 */
app.put('/my/cate/info', (req, res) => {
  const { id, cate_name, cate_alias } = req.body
  const cate = categories.find((c) => c.id === id)
  if (cate) {
    if (cate_name) cate.cate_name = cate_name
    if (cate_alias) cate.cate_alias = cate_alias
  }
  res.json(ok(null, '编辑成功'))
})

/** DELETE /my/cate/del — 删除分类 */
app.delete('/my/cate/del', (req, res) => {
  const id = parseInt(req.query.id)
  const idx = categories.findIndex((c) => c.id === id)
  if (idx !== -1) categories.splice(idx, 1)
  res.json(ok(null, '删除成功'))
})

// ─── 文章管理模块 ─────────────────────────────────────

/** GET /my/article/list — 文章分页列表 */
app.get('/my/article/list', (req, res) => {
  const pagenum = parseInt(req.query.pagenum) || 1
  const pagesize = parseInt(req.query.pagesize) || 5
  const cate_id = req.query.cate_id || ''
  const state = req.query.state || ''

  let filtered = [...articles]
  if (cate_id) filtered = filtered.filter((a) => String(a.cate_id) === String(cate_id))
  if (state) filtered = filtered.filter((a) => a.state === state)

  const total = filtered.length
  const start = (pagenum - 1) * pagesize
  const data = filtered.slice(start, start + pagesize)

  res.json(ok({ data, total }))
})

/** POST /my/article/add — 发布文章（multipart/form-data） */
app.post('/my/article/add', async (req, res) => {
  console.log('[Mock] → POST /my/article/add 收到请求, Content-Type:', req.headers['content-type'])
  try {
    const fields = await parseFormFields(req)
    console.log('[Mock] 解析到的字段:', Object.keys(fields).join(', '))
    const cate = categories.find((c) => c.id === parseInt(String(fields.cate_id)))
    const coverImg = String(fields.cover_img || '')
    const article = {
      id: articleSeq++,
      title: String(fields.title || ''),
      content: String(fields.content || ''),
      cover_img: coverImg || '/images/placeholder.png',
      state: String(fields.state || '已发布'),
      cate_id: parseInt(String(fields.cate_id)) || 1,
      cate_name: cate?.cate_name || '未分类',
      pub_date: new Date().toISOString()
    }
    articles.unshift(article)
    res.json(ok(null, '添加成功'))
  } catch (e) {
    console.error('[Mock] 发布文章异常:', e)
    res.status(500).json({ code: 1, message: 'Mock 内部错误', data: null })
  }
})

/** GET /my/article/info — 获取文章详情 */
app.get('/my/article/info', (req, res) => {
  const id = parseInt(req.query.id)
  const article = articles.find((a) => a.id === id)
  if (!article) return res.json({ code: 1, message: '文章不存在', data: null })
  res.json(ok(article))
})

/** PUT /my/article/info — 编辑文章（multipart/form-data） */
app.put('/my/article/info', async (req, res) => {
  try {
    const fields = await parseFormFields(req)
    const article = articles.find((a) => a.id === parseInt(String(fields.id)))
    if (article) {
      if (fields.title) article.title = String(fields.title)
      if (fields.cate_id) {
        article.cate_id = parseInt(String(fields.cate_id))
        const cate = categories.find((c) => c.id === article.cate_id)
        if (cate) article.cate_name = cate.cate_name
      }
      if (fields.content) article.content = String(fields.content)
      if (fields.state) article.state = String(fields.state)
      if (fields.cover_img) article.cover_img = String(fields.cover_img)
    }
    res.json(ok(null, '编辑成功'))
  } catch (e) {
    console.error('[Mock] 编辑文章异常:', e)
    res.status(500).json({ code: 1, message: 'Mock 内部错误', data: null })
  }
})

/** DELETE /my/article/info — 删除文章 */
app.delete('/my/article/info', (req, res) => {
  const id = parseInt(req.query.id)
  const idx = articles.findIndex((a) => a.id === id)
  if (idx !== -1) articles.splice(idx, 1)
  res.json(ok(null, '删除成功'))
})

// ─── 角色管理模块（Admin RBAC）───────────────────────────

/** GET /admin/roles — 获取角色列表 */
app.get('/admin/roles', (_req, res) => {
  res.json(ok(ROLES))
})

/** GET /admin/permissions — 获取所有可用权限码 */
app.get('/admin/permissions', (_req, res) => {
  res.json(ok(ALL_PERMISSIONS))
})

/** POST /admin/roles — 创建角色 */
app.post('/admin/roles', (req, res) => {
  const { name, label, description, permissions } = req.body
  if (!name || !label) {
    return res.json({ code: 1, message: '角色名和显示名不能为空', data: null })
  }
  const newRole = {
    id: roleSeq++,
    name,
    label,
    description: description || '',
    permissions: permissions || []
  }
  ROLES.push(newRole)
  res.json(ok(newRole, '角色创建成功'))
})

/** PUT /admin/roles/:id — 更新角色 */
app.put('/admin/roles/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const role = ROLES.find((r) => r.id === id)
  if (!role) {
    return res.json({ code: 1, message: '角色不存在', data: null })
  }
  const { name, label, description, permissions } = req.body
  if (name) role.name = name
  if (label) role.label = label
  if (description !== undefined) role.description = description
  if (permissions) role.permissions = permissions
  res.json(ok(null, '角色更新成功'))
})

/** DELETE /admin/roles/:id — 删除角色 */
app.delete('/admin/roles/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const idx = ROLES.findIndex((r) => r.id === id)
  if (idx === -1) {
    return res.json({ code: 1, message: '角色不存在', data: null })
  }
  ROLES.splice(idx, 1)
  res.json(ok(null, '删除成功'))
})

// ─── 全局错误处理（Express 5 要求放在所有路由之后） ─────

app.use((err, _req, res, _next) => {
  console.error('[Mock Error]', err.message || err)
  res.status(500).json({ code: 1, message: err.message || 'Mock 服务内部错误', data: null })
})

// ─── 启动 ─────────────────────────────────────────────

const PORT = 3000
app.listen(PORT, () => {
  console.log(`\n  🎭 Mock API Server running at http://localhost:${PORT}`)
  console.log(`  登录账号: admin / 123456\n`)
})
