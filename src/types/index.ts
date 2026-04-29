/**
 * @fileoverview 全局类型定义文件
 * @description 定义项目所有业务模块的 TypeScript 接口和类型别名
 * @author Vue3 Big Event Admin Team
 * @version 1.0.0
 *
 * @remarks
 * 本文件包含：
 * - API 通用响应结构（ApiResponse）
 * - 用户相关类型（注册、登录、个人信息）
 * - 文章相关类型（分类、列表、详情、发布）
 * - 分页数据通用类型
 *
 * @example
 * ```typescript
 * import type { ApiResponse, UserInfo, ArticleDetail } from '@/types'
 *
 * const userRes: ApiResponse<UserInfo> = await getUserInfo()
 * ```
 */

// ==================== 通用响应结构 ====================

/**
 * API 通用响应数据结构
 * @template T - 响应数据的类型参数
 *
 * @property {number} code - 状态码（0=成功，其他=失败）
 * @property {string} message - 响应消息描述
 * @property {T} data - 业务数据负载
 *
 * @example
 * ```typescript
 * // 成功响应示例
 * {
 *   code: 0,
 *   message: '操作成功',
 *   data: { token: 'xxx' }
 * }
 * ```
 */
export interface ApiResponse<T = any> {
  /** 状态码：0 表示成功 */
  code: number
  /** 响应消息 */
  message: string
  /** 数据载荷 */
  data: T
}

// ==================== 用户相关类型 ====================

/**
 * 用户基本信息接口
 * @description 包含用户的个人资料信息，用于展示和编辑
 *
 * @property {number} id - 用户唯一标识符
 * @property {string} username - 登录用户名（不可修改）
 * @property {string} nickname - 用户昵称（可修改）
 * @property {string} email - 用户邮箱地址（可修改）
 * @property {string | null} user_pic - 用户头像 URL（可为空）
 */
export interface UserInfo {
  /** 用户 ID（主键） */
  id: number
  /** 登录账号 */
  username: string
  /** 显示昵称 */
  nickname: string
  /** 邮箱地址 */
  email: string
  /** 头像图片 URL 或 null */
  user_pic: string | null
}

/**
 * 用户注册表单数据
 * @description 注册新用户时提交的表单字段
 *
 * @property {string} username - 用户名（2-10个非空字符）
 * @property {string} password - 密码（6-15个非空字符）
 * @property {string} repassword - 确认密码（必须与 password 一致）
 *
 * @example
 * ```typescript
 * const formData: RegisterData = {
 *   username: 'zhangsan',
 *   password: '123456',
 *   repassword: '123456'
 * }
 * ```
 */
export interface RegisterData {
  /** 用户名（必填） */
  username: string
  /** 密码（必填） */
  password: string
  /** 确认密码（必填） */
  repassword: string
}

/**
 * 用户登录表单数据
 * @description 用户登录时提交的凭证信息
 *
 * @property {string} username - 登录用户名
 * @property {string} password - 登录密码
 *
 * @example
 * ```typescript
 * const loginForm: LoginData = {
 *   username: 'zhangsan',
 *   password: '123456'
 * }
 * ```
 */
export interface LoginData {
  /** 登录用户名 */
  username: string
  /** 登录密码 */
  password: string
}

/**
 * 登录响应数据
 * @description 成功登录后服务器返回的 Token 信息
 *
 * @property {string} token - JWT 认证令牌（用于后续请求的身份验证）
 */
export interface LoginResponseData {
  /** JWT Bearer Token */
  token: string
}

/**
 * 更新用户基本信息表单
 * @description 编辑个人资料时提交的数据（不含用户名）
 *
 * @property {number} id - 用户 ID（用于后端定位记录）
 * @property {string} nickname - 新的昵称（2-7个非空字符）
 * @property {string} email - 新的邮箱（需符合邮箱格式）
 */
export interface UpdateUserInfoData {
  /** 用户 ID */
  id: number
  /** 新昵称 */
  nickname: string
  /** 新邮箱 */
  email: string
}

/**
 * 修改密码表单数据
 * @description 用户更改密码时的表单字段
 *
 * @property {string} old_pwd - 当前密码（必须正确）
 * @property {string} new_pwd - 新密码（6-15个非空字符）
 * @property {string} re_pwd - 确认新密码（必须与 new_pwd 一致）
 */
export interface UpdatePasswordData {
  /** 当前密码 */
  old_pwd: string
  /** 新密码 */
  new_pwd: string
  /** 确认新密码 */
  re_pwd: string
}

// ==================== 文章分类类型 ====================

/**
 * 文章分类/频道数据
 * @description 用于文章分类管理的增删改查操作
 *
 * @property {number} id - 分类 ID（主键）
 * @property {string} cate_name - 分类名称（如"前端"、"后端"）
 * @property {string} cate_alias - 分类别名（URL 友好标识）
 */
export interface ArticleChannel {
  /** 分类 ID */
  id: number
  /** 分类名称 */
  cate_name: string
  /** 分类别名 */
  cate_alias: string
}

/**
 * 添加/编辑文章分类表单
 * @description 创建或更新分类时的表单数据
 *
 * @property {number} [id] - 分类 ID（编辑时必需，新增时忽略）
 * @property {string} cate_name - 分类名称
 * @property {string} cate_alias - 分类别名
 */
export interface ChannelFormData {
  /** 分类 ID（可选，编辑模式） */
  id?: number
  /** 分类名称 */
  cate_name: string
  /** 分类别名 */
  cate_alias: string
}

// ==================== 文章内容类型 ====================

/**
 * 文章列表查询参数
 * @description 分页查询文章时的请求参数
 *
 * @property {number} pagenum - 当前页码（从 1 开始）
 * @property {number} pagesize - 每页显示条数（默认 5）
 * @property {string | number} [cate_id] - 可选的分类筛选条件
 * @property {string} [state] - 可选的状态筛选（'已发布'/'草稿'）
 */
export interface ArticleListParams {
  /** 页码（从1开始） */
  pagenum: number
  /** 每页数量 */
  pagesize: number
  /** 分类ID筛选（可选） */
  cate_id?: string | number
  /** 发布状态筛选（可选） */
  state?: string
}

/**
 * 文章详情数据
 * @description 单篇文章的完整信息（含关联数据）
 *
 * @property {number} id - 文章 ID（主键）
 * @property {string} title - 文章标题
 * @property {string} pub_date - 发布时间（ISO 格式）
 * @property {string} state - 发布状态（已发布/草稿）
 * @property {number} cate_id - 所属分类 ID
 * @property {string} content - 文章正文（Markdown/HTML）
 * @property {string} cover_img - 封面图片 URL
 * @property {string} cate_name - 所属分类名称（关联查询）
 */
export interface ArticleDetail {
  /** 文章 ID */
  id: number
  /** 文章标题 */
  title: string
  /** 发布日期 */
  pub_date: string
  /** 发布状态 */
  state: string
  /** 分类 ID */
  cate_id: number
  /** 文章内容 */
  content: string
  /** 封面图 URL */
  cover_img: string
  /** 分类名称 */
  cate_name: string
}

/**
 * 发布文章表单数据
 * @description 使用 FormData 格式上传文章（支持文件上传）
 *
 * @remarks
 * 由于需要上传封面图片，使用 FormData 而非 JSON：
 * - 表单字段：title, cate_id, content, state, cover_img
 * - cover_img 为 File 对象
 */
export type PublishArticleFormData = FormData

// ==================== 通用分页类型 ====================

/**
 * 分页响应数据结构
 * @template T - 列表项的类型参数
 *
 * @property {T[]} data - 当前页的数据列表
 * @property {number} total - 总记录数（用于计算总页数）
 *
 * @example
 * ```typescript
 * // 文章分页响应
 * type ArticleListResponse = PaginatedData<ArticleDetail>
 * // { data: [...], total: 100 }
 * ```
 */
export interface PaginatedData<T> {
  /** 当前页数据列表 */
  data: T[]
  /** 总记录数 */
  total: number
}
