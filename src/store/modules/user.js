import { getToken, setToken, removeToken } from '@/utils/auth'
import { setStore, getStore } from '@/utils/store'

const user = {
  state: {
    access_token: getStore({ name: 'access_token' }) || ''
  },
  actions: {

  },
  mutations: {

  }
}

export default user
