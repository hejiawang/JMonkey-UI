import request from '@/utils/request'

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
 * 删除用户信息
 * @param id 用户ID
 */
export function del(id) {
  return request({
    url: '/upms/user/delete/' + id,
    method: 'delete'
  })
}
