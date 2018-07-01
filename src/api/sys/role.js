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

/**
 * 校验角色code是否存在
 * @param id 角色ID
 * @param code 角色Code
 */
export function checkCode( id, code) {
  return request({
    url: '/upms/role/checkCode',
    data: {
      id: id,
      code: code
    },
    method: 'post'
  })
}

export function checkName( id, name) {
  return request({
    url: '/upms/role/checkName',
    data: {
      id: id,
      name: name
    },
    method: 'post'
  })
}
