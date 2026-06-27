/**
 * @fileoverview 全局类型定义：API 响应、用户、文章分类/内容、分页
 */

/** API 通用响应数据结构 */
export interface ApiResponse<T = any> {
  /** 状态码：0 表示成功 */
  code: number
  /** 响应消息 */
  message: string
  /** 数据载荷 */
  data: T
}

// ==================== 用户相关类型 ====================

/** 用户基本信息（username 不可修改，nickname/email 可修改） */
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

/** 用户注册表单数据 */
export interface RegisterData {
  /** 用户名 */
  username: string
  /** 密码 */
  password: string
  /** 确认密码（必须与 password 一致） */
  repassword: string
}

/** 用户登录表单数据 */
export interface LoginData {
  /** 登录用户名 */
  username: string
  /** 登录密码 */
  password: string
}

/** 登录响应数据，包含 JWT 认证令牌 */
export interface LoginResponseData {
  /** JWT Bearer Token */
  token: string
}

/** 更新用户基本信息表单（不含用户名） */
export interface UpdateUserInfoData {
  /** 用户 ID */
  id: number
  /** 新昵称 */
  nickname: string
  /** 新邮箱 */
  email: string
}

/** 修改密码表单数据 */
export interface UpdatePasswordData {
  /** 当前密码（必须正确） */
  old_pwd: string
  /** 新密码（6-15个非空字符） */
  new_pwd: string
  /** 确认新密码（必须与 new_pwd 一致） */
  re_pwd: string
}

// ==================== 文章分类类型 ====================

/** 文章分类/频道数据 */
export interface ArticleChannel {
  /** 分类 ID */
  id: number
  /** 分类名称 */
  cate_name: string
  /** 分类别名 */
  cate_alias: string
}

/** 添加/编辑文章分类表单（id 在编辑时必需，新增时忽略） */
export interface ChannelFormData {
  /** 分类 ID（可选，编辑模式） */
  id?: number
  /** 分类名称 */
  cate_name: string
  /** 分类别名 */
  cate_alias: string
}

// ==================== 文章内容类型 ====================

/** 文章列表查询参数 */
export interface ArticleListParams {
  /** 页码（从1开始） */
  pagenum: number
  /** 每页数量 */
  pagesize: number
  /** 分类ID筛选（可选） */
  cate_id?: string | number
  /** 发布状态筛选（可选：'已发布'/'草稿'） */
  state?: string
}

/** 文章详情数据（含关联的分类名称） */
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
  /** 文章内容（Markdown/HTML） */
  content: string
  /** 封面图 URL */
  cover_img: string
  /** 分类名称（关联查询） */
  cate_name: string
}

/**
 * 发布文章表单数据
 * 使用 FormData 是因为需上传封面图片文件（cover_img 为 File 对象）
 */
export type PublishArticleFormData = FormData

// ==================== 通用分页类型 ====================

/** 分页响应数据结构 */
export interface PaginatedData<T> {
  /** 当前页数据列表 */
  data: T[]
  /** 总记录数 */
  total: number
}
