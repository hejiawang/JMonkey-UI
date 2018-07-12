import { getToken, setToken, removeToken } from '@/utils/auth'
import { setStore, getStore } from '@/utils/store'
import { loginByUsername, logout, getUserInfo } from '@/api/login'

const user = {
  state: {
    access_token: getStore({ name: 'access_token' }) || '',
    userInfo: getStore({ name: 'userInfo' }) || {},
    permissions: getStore({ name: 'permissions' }) || {},
    roles: getStore({ name: 'roles' }) || [],
  },
  actions: {
    /**
     * 根据用户名登录
     * @param commit
     * @param state
     * @param dispatch
     * @param userInfo
     * @returns {Promise}
     * @constructor
     */
    LoginByUsername({ commit, state, dispatch }, userInfo) {
      return new Promise((resolve, reject) => {
        loginByUsername(userInfo.username, userInfo.password, userInfo.code, userInfo.randomStr).then(data => {
          setToken(data.access_token);
          commit('SET_ACCESS_TOKEN', data.access_token);
          commit('SET_REFRESH_TOKEN', data.refresh_token);

          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    /**
     * 获取用户信息，存储用户的基本信息、角色信息、权限信息
     * @param commit
     * @param state
     * @param dispatch
     * @returns {Promise}
     * @constructor
     */
    GetUserInfo({ commit, state, dispatch }) {
      return new Promise((resolve, reject) => {
        getUserInfo().then(data => {
          commit('SET_USER_INFO', data.result.user);
          commit('SET_ROLES', data.result.roleCodeList);
          commit('SET_PERMISSIONS', data.result.permissionList);

          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },
  },
  mutations: {
    SET_ACCESS_TOKEN: (state, access_token) => {
      state.access_token = access_token
      setStore({
        name: 'access_token',
        content: state.access_token,
        type: 'session'
      })
    },
    SET_REFRESH_TOKEN: (state, rfToken) => {
      state.refresh_token = rfToken
      setStore({
        name: 'refresh_token',
        content: state.refresh_token,
        type: 'session'
      })
    },
    SET_USER_INFO: (state, userInfo) => {
      state.userInfo = userInfo
      setStore({
        name: 'userInfo',
        content: state.userInfo,
        type: 'session'
      })
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
      setStore({
        name: 'roles',
        content: state.roles,
        type: 'session'
      })
    },
    SET_PERMISSIONS: (state, permissions) => {
      const list = {}
      for (let i = 0; i < permissions.length; i++) {
        list[permissions[i]] = true
      }
      state.permissions = list
      setStore({
        name: 'permissions',
        content: state.permissions,
        type: 'session'
      })
    }
  }
}

export default user
