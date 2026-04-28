import request from '@/utils/request'

/**
 * 获取文章分类列表
 * @returns Promise
 */
export const artGetChannelsService = () => request.get('/my/cate/list')

/**
 * 添加文章分类
 * @param {Object} data - 分类信息 { cate_name, cate_alias }
 * @returns Promise
 */
export const artAddChannelService = (data) => request.post('/my/cate/add', data)

/**
 * 编辑文章分类
 * @param {Object} data - 分类信息 { id, cate_name, cate_alias }
 * @returns Promise
 */
export const artEditChannelService = (data) =>
  request.put('/my/cate/info', data)

/**
 * 删除文章分类
 * @param {Number} id - 分类 ID
 * @returns Promise
 */
export const artDelChannelService = (id) =>
  request.delete('/my/cate/del', {
    params: { id }
  })

/**
 * 获取文章列表
 * @param {Object} params - 查询参数 { pagenum, pagesize, cate_id, state }
 * @returns Promise
 */
export const artGetListService = (params) =>
  request.get('/my/article/list', {
    params
  })

/**
 * 发布文章
 * @param {FormData} data - 文章信息 (需包含 title, cate_id, content, cover_img, state)
 * @returns Promise
 */
export const artPublishService = (data) => request.post('/my/article/add', data)

/**
 * 获取文章详情
 * @param {Number} id - 文章 ID
 * @returns Promise
 */
export const artGetDetailService = (id) =>
  request.get('/my/article/info', {
    params: { id }
  })

/**
 * 编辑文章
 * @param {FormData} data - 文章信息 (需包含 id, title, cate_id, content, cover_img, state)
 * @returns Promise
 */
export const artEditService = (data) => request.put('/my/article/info', data)

/**
 * 删除文章
 * @param {Number} id - 文章 ID
 * @returns Promise
 */
export const artDelService = (id) =>
  request.delete('/my/article/info', { params: { id } })
