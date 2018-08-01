import request from '@/utils/request'

/**
 * 字典类型列表数据
 * @param query
 */
export function list( query ) {
  return request({
    url: '/upms/dict/type/list',
    method: 'get',
    params: query
  })
}

/**
 * 获取字典类型
 * @param id 字典类型ID
 */
export function find(id) {
  return request({
    url: '/upms/dict/type/find/' + id,
    method: 'get'
  })
}

/**
 * 保存字典类型信息
 * @param obj 字典类型信息
 */
export function save(obj) {
  return request({
    url: '/upms/dict/type/save',
    method: 'post',
    data: obj
  })
}

/**
 * 修改字典类型信息
 * @param obj 字典类型信息
 */
export function modify(obj) {
  return request({
    url: '/upms/dict/type/modify',
    method: 'put',
    data: obj
  })
}

/**
 * 删除字典类型信息
 * @param id 字典类型ID
 */
export function del(id) {
  return request({
    url: '/upms/dict/type/delete/' + id,
    method: 'delete'
  })
}

/**
 * 校验字典类型是否存在
 * @param id 字典类型ID
 * @param type 字典类型type
 */
export function checkExist( id, type) {
  return request({
    url: '/upms/dict/type/checkExist',
    data: {
      id: id,
      type: type
    },
    method: 'post'
  })
}


