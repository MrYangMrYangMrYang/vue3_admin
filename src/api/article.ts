/**
 * @fileoverview 文章管理模块 API 接口
 * @description 封装文章分类和文章内容的 CRUD 操作接口
 * @author Vue3 Big Event Admin Team
 * @version 1.0.0
 *
 * @remarks
 * 本模块包含两大功能：
 *
 * **1. 文章分类管理**
 * - 获取分类列表（GET /my/cate/list）
 * - 添加分类（POST /my/cate/add）
 * - 编辑分类（PUT /my/cate/info）
 * - 删除分类（DELETE /my/cate/del）
 *
 * **2. 文章内容管理**
 * - 获取文章列表（分页）（GET /my/article/list）
 * - 发布文章（POST /my/article/add）
 * - 获取文章详情（GET /my/article/info）
 * - 编辑文章（PUT /my/article/info）
 * - 删除文章（DELETE /my/article/info）
 *
 * @example
 * ```typescript
 * import {
 *   artGetListService,
 *   artPublishService,
 *   artDelService
 * } from '@/api/article'
 *
 * // 分页查询文章
 * const articles = await artGetListService({
 *   pagenum: 1,
 *   pagesize: 10,
 *   state: '已发布'
 * })
 *
 * // 发布新文章
 * const formData = new FormData()
 * formData.append('title', '我的第一篇文章')
 * formData.append('cover_img', file)
 * await artPublishService(formData)
 * ```
 */

import request from '@/utils/request'
import type { AxiosResponse } from 'axios'
import type {
  ChannelFormData,
  ArticleListParams,
  PublishArticleFormData,
  ArticleDetail,
  ArticleChannel,
  PaginatedData,
  ApiResponse
} from '@/types'

// ==================== 文章分类管理 ====================

/**
 * 获取文章分类列表
 * @description 查询系统中所有的文章分类/频道，用于下拉选择框展示
 *
 * @returns {Promise<AxiosResponse<ApiResponse<ArticleChannel[]>>>}
 * 分类数组，每项包含 id, cate_name, cate_alias
 *
 * @example
 * ```typescript
 * const res = await artGetChannelsService()
 * const channels = res.data.data
 * // channels = [
 * //   { id: 1, cate_name: '前端', cate_alias: 'frontend' },
 * //   { id: 2, cate_name: '后端', cate_alias: 'backend' }
 * // ]
 * ```
 */
export const artGetChannelsService = (): Promise<
  AxiosResponse<ApiResponse<ArticleChannel[]>>
> => request.get('/my/cate/list')

/**
 * 添加文章分类
 * @description 创建新的文章分类（需要管理员权限）
 *
 * @param {ChannelFormData} data - 分类表单数据
 * @param {string} [data.id] - 编辑时的分类 ID（新增时忽略）
 * @param {string} data.cate_name - 分类名称
 * @param {string} data.cate_alias - 分类别名（URL 友好）
 *
 * @returns {Promise<AxiosResponse<ApiResponse<null>>>} 创建结果
 *
 * @example
 * ```typescript
 * await artAddChannelService({
 *   cate_name: '数据库',
 *   cate_alias: 'database'
 * })
 * ElMessage.success('分类创建成功')
 * ```
 */
export const artAddChannelService = (
  data: ChannelFormData
): Promise<AxiosResponse<ApiResponse<null>>> =>
  request.post('/my/cate/add', data)

/**
 * 编辑文章分类
 * @description 更新已有分类的名称和别名
 *
 * @param {ChannelFormData} data - 包含 ID 的分类数据
 * @param {number} data.id - 要编辑的分类 ID（必填）
 * @param {string} data.cate_name - 新的分类名称
 * @param {string} data.cate_alias - 新的分类别名
 *
 * @returns {Promise<AxiosResponse<ApiResponse<null>>>} 更新结果
 *
 * @example
 * ```typescript
 * await artEditChannelService({
 *   id: 5,
 *   cate_name: '前端开发',
 *   cate_alias: 'frontend-dev'
 * })
 * ```
 */
export const artEditChannelService = (
  data: ChannelFormData
): Promise<AxiosResponse<ApiResponse<null>>> =>
  request.put('/my/cate/info', data)

/**
 * 删除文章分类
 * @description 根据分类 ID 删除指定分类（级联删除关联文章？）
 *
 * @param {number} id - 要删除的分类 ID
 *
 * @returns {Promise<AxiosResponse<ApiResponse<null>>>} 删除结果
 *
 * @warning 删除分类可能会影响该分类下的所有文章！建议先确认。
 *
 * @example
 * ```typescript
 * try {
 *   await ElMessageBox.confirm(
 *     '确定要删除该分类吗？删除后该分类下的文章将变为"未分类"。',
 *     '警告',
 *     { type: 'warning' }
 *   )
 *   await artDelChannelService(5)
 *   ElMessage.success('删除成功')
 * } catch {
 *   // 用户取消删除
 * }
 * ```
 */
export const artDelChannelService = (
  id: number
): Promise<AxiosResponse<ApiResponse<null>>> =>
  request.delete('/my/cate/del', { params: { id } })

// ==================== 文章内容管理 ====================

/**
 * 获取文章列表（分页查询）
 * @description 支持按分类、状态筛选的分页文章查询
 *
 * @param {ArticleListParams} params - 查询参数
 * @param {number} params.pagenum - 页码（从 1 开始）
 * @param {number} params.pagesize - 每页条数（默认 5-10）
 * @param {string | number} [params.cate_id] - 可选：分类 ID 筛选
 * @param {string} [params.state] - 可选：状态筛选（'已发布'/'草稿'）
 *
 * @returns {Promise<AxiosResponse<ApiResponse<PaginatedData<ArticleDetail>>>>}
 * 分页数据结构：
 * - data: 当前页的文章数组
 * - total: 总记录数（用于计算总页数）
 *
 * @example
 * ```typescript
 * // 基础查询（第1页，每页10条）
 * const res = await artGetListService({
 *   pagenum: 1,
 *   pagesize: 10
 * })
 *
 * // 带筛选条件
 * const filtered = await artGetListService({
 *   pagenum: 1,
 *   pagesize: 10,
 *   cate_id: 3,        // 只查"前端"分类
 *   state: '已发布'    // 只查已发布的文章
 * })
 *
 * console.log(`共 ${filtered.data.data.total} 条记录`)
 * ```
 */
export const artGetListService = (
  params: ArticleListParams
): Promise<AxiosResponse<ApiResponse<PaginatedData<ArticleDetail>>>> =>
  request.get('/my/article/list', { params })

/**
 * 发布新文章
 * @description 创建新文章（支持富文本和封面图上传）
 *
 * @param {PublishArticleFormData} data - 文章表单数据（FormData 格式）
 * @property {string} data.title - 文章标题
 * @property {number} data.cate_id - 所属分类 ID
 * @property {string} data.content - 文章正文（Markdown/HTML）
 * @property {string} data.state - 发布状态（'已发布'/'草稿'）
 * @property {File} data.cover_img - 封面图片文件
 *
 * @returns {Promise<AxiosResponse<ApiResponse<null>>>} 发布结果
 *
 * @remarks
 * 使用 FormData 格式的原因：
 * - 需要上传封面图片文件（二进制数据）
 * - Content-Type 会自动设置为 multipart/form-data
 *
 * @example
 * ```typescript
 * const formData = new FormData()
 * formData.append('title', 'Vue 3 Composition API 入门')
 * formData.append('cate_id', '1')
 * formData.append('content', '<h1>Hello Vue 3</h1>')
 * formData.append('state', '已发布')
 * formData.append('cover_img', imageFile)  // File 对象
 *
 * await artPublishService(formData)
 * ElMessage.success('文章发布成功')
 * ```
 */
export const artPublishService = (
  data: PublishArticleFormData
): Promise<AxiosResponse<ApiResponse<null>>> =>
  request.post('/my/article/add', data)

/**
 * 获取文章详情
 * @description 根据 ID 查询单篇文章的完整信息
 *
 * @param {number} id - 文章 ID
 *
 * @returns {Promise<AxiosResponse<ApiResponse<ArticleDetail>>>}
 * 文章详情对象（含标题、内容、分类、封面等）
 *
 * @example
 * ```typescript
 * const res = await artGetDetailService(42)
 * const article = res.data.data
 * console.log(article.title)      // 文章标题
 * console.log(article.content)    // 文章内容
 * console.log(article.cate_name)  // 分类名称
 * ```
 */
export const artGetDetailService = (
  id: number
): Promise<AxiosResponse<ApiResponse<ArticleDetail>>> =>
  request.get('/my/article/info', { params: { id } })

/**
 * 编辑已有文章
 * @description 更新文章的内容、标题、分类等信息
 *
 * @param {PublishArticleFormData & { id: number }} data - 表单数据 + 文章 ID
 * @param {number} data.id - 必填：要编辑的文章 ID
 * @param {FormData} 其他字段同 publishService
 *
 * @returns {Promise<AxiosResponse<ApiResponse<null>>>} 编辑结果
 *
 * @example
 * ```typescript
 * const formData = new FormData()
 * formData.append('id', '42')           // 必须提供文章 ID
 * formData.append('title', '更新后的标题')
 * formData.append('content', '更新后的内容...')
 * // ... 其他字段
 *
 * await artEditService(formData as any)
 * ElMessage.success('文章更新成功')
 * ```
 */
export const artEditService = (
  data: FormData
): Promise<AxiosResponse<ApiResponse<null>>> =>
  request.put('/my/article/info', data)

/**
 * 删除文章
 * @description 根据文章 ID 永久删除文章（不可恢复）
 *
 * @param {number} id - 要删除的文章 ID
 *
 * @returns {Promise<AxiosResponse<ApiResponse<null>>>} 删除结果
 *
 * @warning 此操作不可逆！删除前应提示用户确认。
 *
 * @example
 * ```typescript
 * try {
 *   await ElMessageBox.confirm(
 *     '确定要删除这篇文章吗？删除后无法恢复。',
 *     '危险操作',
 *     { type: 'error', confirmButtonText: '确认删除' }
 *   )
 *   await artDelService(42)
 *   ElMessage.success('文章已删除')
 *   // 刷新列表...
 * } catch {
 *   // 用户取消
 * }
 * ```
 */
export const artDelService = (
  id: number
): Promise<AxiosResponse<ApiResponse<null>>> =>
  request.delete('/my/article/info', { params: { id } })
