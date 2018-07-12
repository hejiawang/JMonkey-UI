const getters = {
  website: state => state.common.website,
  access_token: state => state.user.access_token,
  roles: state => state.user.roles,
  permissions: state => state.user.permissions,
  userInfo: state => state.user.userInfo,
}
export default getters
