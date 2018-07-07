import request from '@/utils/request'
import qs from 'qs';

export function saveRoles(userId, roleIds) {
  return request({
    url: '/upms/userRole/saveRoles',
    method: 'post',
    data: qs.stringify({
      userId: userId,
      roleIds: roleIds
    }, {arrayFormat: 'brackets'})
  })
}
