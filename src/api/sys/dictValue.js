import request from '@/utils/request'

/**
 * 字典值列表数据
 * @param query
 */
export function list( query ) {
  return request({
    url: '/upms/dict/value/listAll',
    method: 'get',
    params: query
  })
}

/**
 * 获取字典值
 * @param id 字典值ID
 */
export function find(id) {
  return request({
    url: '/upms/dict/value/find/' + id,
    method: 'get'
  })
}

/**
 * 保存字典值
 * @param obj 字典值
 */
export function save(obj) {
  return request({
    url: '/upms/dict/value/save',
    method: 'post',
    data: obj
  })
}

/**
 * 修改字典值
 * @param obj 字典值
 */
export function modify(obj) {
  return request({
    url: '/upms/dict/value/modify',
    method: 'put',
    data: obj
  })
}

/**
 * 删除字典值
 * @param id 字典值D
 */
export function del(id) {
  return request({
    url: '/upms/dict/value/delete/' + id,
    method: 'delete'
  })
}
