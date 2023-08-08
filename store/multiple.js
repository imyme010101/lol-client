import { createBasicSummonerData, createRecordsData } from '@/helpers/summoner'

export const namespaced = true

export const state = () => ({
  summoners: [],
  status: ''
})

export const mutations = {
  MULTIPLE_REQUEST(state) {
    state.status = 'loading'
  },

  MULTIPLE_FOUND(state, infos) {
    state.status = 'found'
    state.summoners = infos
  },

  MULTIPLE_NOT_FOUND(state) {
    state.status = 'error'
  },
}

export const actions = {
  async multipleRequest({ commit, dispatch, rootState }, { summoners, region }) {
    const regionId = rootState.settings.regionsList[region]
    commit('MULTIPLE_REQUEST')
    
    try {
      
      const resp = await this.$axios.$post('multiple', { summoners: summoners, region: regionId })
      
      if (!resp) {
        dispatch('notification/add', {
          type: 'error',
          message: '멀티 서치 검색에 실패 하였습니다.'
        }, { root: true })
        // return commit('SUMMONER_NOT_FOUND')
      }
      
      resp.rankeds = resp.rankeds.map((value) => {
        return createBasicSummonerData(value)
      })
      commit('MULTIPLE_FOUND', resp)

      return resp.multipleId
    } catch (error) {
      if (error.response && error.response.status === 422) {
        dispatch('notification/add', {
          type: 'error',
          message: 'Summoner not found.'
        }, { root: true })
      }

      if (error.message !== 'Summoner changed') {
        commit('MULTIPLE_NOT_FOUND')
      }
    }
  }
}

export const getters = {
  multipleFound: state => state.status === 'found',
  multipleNotFound: state => state.status === 'error',
  multipleLoading: state => state.status === 'loading',
}