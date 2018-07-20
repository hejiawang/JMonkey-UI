import request from '@/utils/request'

/**
 * 根据用户名登录
 * oauth规则示例:
 *  http://localhost:8088/jmonkey/auth/oauth/token?username=admin&password=123456&grant_type=password&scope=server&client_id=JMonkey_client_id&client_secret=JMonkey_client_secret
 * @param username 用户名
 * @param password 密码
 * @param code 验证码
 * @param randomStr 验证码key
 */
export const loginByUsername = (username, password, code, randomStr) => {
  var grant_type = 'password', scope = 'server', client_id = 'JMonkey_client_id', client_secret = 'JMonkey_client_secret';
  return request({
    url: '/auth/oauth/token',
    headers: {
      'Authorization': 'Basic cGlnOnBpZw=='
    },
    method: 'post',
    params: { username, password, randomStr, code, grant_type, scope, client_id, client_secret}
  })
}

export const getUserInfo = ( ) => {
  return request({
    url: '/upms/user/info',
    method: 'get'
  })
}

export const getMenuInfo = () => {
  return request({
    url: '/upms/menu/userMenu',
    method: 'get'
  })
}

/**
 * 退出登录
 * @param accesstoken access_token
 * @param refreshToken refresh_token
 */
export const logout = (accesstoken, refreshToken) => {
  return request({
    url: '/auth/authentication/removeToken',
    method: 'post',
    params: { accesstoken, refreshToken }
  })
}
