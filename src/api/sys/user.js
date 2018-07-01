import request from '@/utils/request'
import user from "../../store/modules/user";

/**
 * 用户列表数据
 * @param query
 */
export function list( query ) {
  return request({
    url: '/upms/user/list',
    method: 'get',
    params: query
  })
}

/**
 * 获取用户信息
 * @param id 用户ID
 */
export function find(id) {
  return request({
    url: '/upms/user/find/' + id,
    method: 'get'
  })
}

/**
 * 保存用户信息
 * @param obj 用户信息
 */
export function save(obj) {
  return request({
    url: '/upms/user/save',
    method: 'post',
    data: obj
  })
}

/**
 * 修改用户信息
 * @param obj 用户信息
 */
export function modify(obj) {
  return request({
    url: '/upms/user/modify',
    method: 'put',
    data: obj
  })
}

/**
 * 删除用户信息
 * @param id 用户ID
 */
export function del(id) {
  return request({
    url: '/upms/user/delete/' + id,
    method: 'delete'
  })
}

/**
 * 校验用户名是否存在
 * @param id 用户ID
 * @param userName 用户名称
 */
export function checkUserName( id, userName ) {
  return request({
    url: '/upms/user/checkUserName',
    data: {
      id: id,
      username: userName
    },
    method: 'post',
  })
}
