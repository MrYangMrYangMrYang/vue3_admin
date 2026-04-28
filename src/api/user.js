import request from '@/utils/request'

/**
 * 用户注册
 * @param {Object} data - 注册信息 { username, password, repassword }
 * @returns Promise
 */
export const userRegisterService = ({ username, password, repassword }) =>
  request.post('/api/reg', { username, password, repassword })

/**
 * 用户登录
 * @param {Object} data - 登录信息 { username, password }
 * @returns Promise
 */
export const userLoginService = ({ username, password }) =>
  request.post('/api/login', { username, password })

/**
 * 获取用户基本信息
 * @returns Promise
 */
export const userGetInfoService = () => request.get('/my/userinfo')

/**
 * 更新用户基本信息
 * @param {Object} data - 用户信息 { id, nickname, email }
 * @returns Promise
 */
export const userUpdateInfoService = ({ id, nickname, email }) =>
  request.put('/my/userinfo', { id, nickname, email })

/**
 * 更新用户头像
 * @param {String} avatar - 头像图片的 base64 字符串
 * @returns Promise
 */
export const userUpdateAvatarService = (avatar) =>
  request.patch('/my/update/avatar', { avatar })

/**
 * 更新用户密码
 * @param {Object} data - 密码信息 { old_pwd, new_pwd, re_pwd }
 * @returns Promise
 */
export const userUpdatePasswordService = ({ old_pwd, new_pwd, re_pwd }) =>
  request.patch('/my/updatepwd', { old_pwd, new_pwd, re_pwd })
