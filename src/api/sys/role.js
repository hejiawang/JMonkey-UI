import request from '@/utils/request'

/**
 * 角色列表数据
 * @param query
 */
export function list( query ) {
  return request({
    url: '/upms/role/list',
    method: 'get',
    params: query
  })
}

/**
 * 获取角色信息
 * @param id 角色ID
 */
export function find(id) {
  return request({
    url: '/upms/role/find/' + id,
    method: 'get'
  })
}

/**
 * 保存角色信息
 * @param obj 角色信息
 */
export function save(obj) {
  return request({
    url: '/upms/role/save',
    method: 'post',
    data: obj
  })
}

/**
 * 修改角色信息
 * @param obj 角色信息
 */
export function modify(obj) {
  return request({
    url: '/upms/role/modify',
    method: 'put',
    data: obj
  })
}

/**
 * 删除角色信息
 * @param id 角色ID
 */
export function del(id) {
  return request({
    url: '/upms/role/delete/' + id,
    method: 'delete'
  })
}
