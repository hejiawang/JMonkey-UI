import website from '@/const/website'
import { setStore, getStore } from '@/utils/store'

const common = {
  state: {
    website: website,
    crumb: getStore({ name: 'crumb' }) || [],
  },
  mutations: {
    SET_CRUMB: (state, crumb) => {
      state.crumb = crumb
      setStore({
        name: 'crumb',
        content: state.crumb,
        type: 'session'
      })
    }
  }
}


export default common
