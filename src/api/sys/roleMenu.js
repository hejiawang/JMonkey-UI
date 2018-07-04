import request from '@/utils/request'

/**
 * 根据角色获取角色菜单权限
 * @param id 角色ID
 */
export function findMenuByRole( id ) {
  return request({
    url: '/upms/roleMenu/findMenuByRole/' + id,
    method: 'get'
  })
}

/**
 * 更新角色权限
 * @param roleId 角色ID
 * @param menuIds 菜单ID数组
 */
export function modifyAuth(roleId, menuIds) {
  return request({
    url: '/upms/roleMenu/modifyAuth',
    method: 'put',
    params: {
      roleId: roleId,
      menuIds: menuIds
    }
  })
}