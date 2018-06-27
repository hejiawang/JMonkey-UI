import { getToken, setToken, removeToken } from '@/utils/auth'
import { setStore, getStore } from '@/utils/store'
import { loginByUsername, logout } from '@/api/login'

const user = {
  state: {
    access_token: getStore({ name: 'access_token' }) || ''
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
        loginByUsername(userInfo.username, userInfo.password, userInfo.code, userInfo.randomStr).then(response => {
          const data = response.data;

          setToken(data.access_token);
          commit('SET_ACCESS_TOKEN', data.access_token);
          commit('SET_REFRESH_TOKEN', data.refresh_token);

          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
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
    }
  }
}

export default user
