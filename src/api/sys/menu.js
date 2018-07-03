import request from '@/utils/request'

/**
 * 菜单树形表格数据
 */
export function treeList( ) {
  return request({
    url: '/upms/menu/treeList',
    method: 'get'
  })
}

/**
 * 根据菜单ID获取菜单信息
 * @param id 菜单ID
 */
export function find(id) {
  return request({
    url: '/upms/menu/find/' + id,
    method: 'get'
  })
}

/**
 * 存储菜单信息
 * @param obj 菜单
 */
export function save(obj) {
  return request({
    url: '/upms/menu/save',
    method: 'post',
    data: obj
  })
}

/**
 * 修改菜单信息
 * @param obj 菜单信息
 */
export function modify(obj) {
  return request({
    url: '/upms/menu/modify',
    method: 'put',
    data: obj
  })
}

/**
 * 删除菜单信息
 * @param id 菜单ID
 */
export function del(id) {
  return request({
    url: '/upms/menu/delete/' + id,
    method: 'delete'
  })
}
