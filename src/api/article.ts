/**
 * @fileoverview 文章管理模块 API（分类 CRUD + 文章 CRUD）
 */

import request from '@/utils/request'
import type {
  ChannelFormData,
  ArticleListParams,
  PublishArticleFormData,
  ArticleDetail,
  ArticleChannel,
  PaginatedData,
  ApiResponse
} from '@/types'

/**
 * 获取文章分类列表
 * @returns 分类数组，每项包含 id, cate_name, cate_alias
 */
export const artGetChannelsService = (): Promise<
  ApiResponse<ArticleChannel[]>
> => request.get('/my/cate/list')

/**
 * 添加文章分类
 * @param data 分类表单数据（cate_name, cate_alias）
 */
export const artAddChannelService = (
  data: ChannelFormData
): Promise<ApiResponse<null>> => request.post('/my/cate/add', data)

/**
 * 编辑文章分类
 * @param data 包含 ID 的分类数据
 */
export const artEditChannelService = (
  data: ChannelFormData
): Promise<ApiResponse<null>> => request.put('/my/cate/info', data)

/**
 * 删除文章分类
 * @warning 删除分类可能会影响该分类下的所有文章！建议先确认。
 * @param id 要删除的分类 ID
 */
export const artDelChannelService = (id: number): Promise<ApiResponse<null>> =>
  request.delete('/my/cate/del', { params: { id } })

/**
 * 获取文章列表（分页查询）
 * @param params 查询参数（pagenum, pagesize, 可选 cate_id/state）
 * @returns 分页数据：data 当前页文章数组，total 总记录数
 */
export const artGetListService = (
  params: ArticleListParams
): Promise<ApiResponse<PaginatedData<ArticleDetail>>> =>
  request.get('/my/article/list', { params })

/**
 * 发布新文章
 * @remarks 使用 FormData 是因为需上传封面图片文件，Content-Type 自动为 multipart/form-data
 * @param data 文章表单数据（FormData：title, cate_id, content, state, cover_img）
 */
export const artPublishService = (
  data: PublishArticleFormData
): Promise<ApiResponse<null>> => request.post('/my/article/add', data)

/**
 * 获取文章详情
 * @param id 文章 ID
 */
export const artGetDetailService = (
  id: number
): Promise<ApiResponse<ArticleDetail>> =>
  request.get('/my/article/info', { params: { id } })

/**
 * 编辑已有文章
 * @param data 表单数据 + 文章 ID
 */
export const artEditService = (data: FormData): Promise<ApiResponse<null>> =>
  request.put('/my/article/info', data)

/**
 * 删除文章
 * @warning 此操作不可逆！删除前应提示用户确认。
 * @param id 要删除的文章 ID
 */
export const artDelService = (id: number): Promise<ApiResponse<null>> =>
  request.delete('/my/article/info', { params: { id } })
