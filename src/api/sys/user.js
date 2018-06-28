import request from '@/utils/request'

export function save(obj) {
  return request({
    url: '/upms/user/save',
    method: 'post',
    data: obj
  })
}
