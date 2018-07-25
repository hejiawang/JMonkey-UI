import request from '@/utils/request'

/**
 * 部门树形数据
 */
export function treeList( ) {
  return request({
    url: '/upms/dept/treeList',
    method: 'get'
  })
}

/**
 * 根据部门ID获取部门信息
 * @param id 部门ID
 */
export function find(id) {
  return request({
    url: '/upms/dept/find/' + id,
    method: 'get'
  })
}

/**
 * 存储部门信息
 * @param obj 部门信息
 */
export function save(obj) {
  return request({
    url: '/upms/dept/save',
    method: 'post',
    data: obj
  })
}

/**
 * 修改部门信息
 * @param obj 部门信息
 */
export function modify(obj) {
  return request({
    url: '/upms/dept/modify',
    method: 'put',
    data: obj
  })
}

/**
 * 删除部门信息
 * @param id 部门ID
 */
export function del(id) {
  return request({
    url: '/upms/dept/delete/' + id,
    method: 'delete'
  })
}
