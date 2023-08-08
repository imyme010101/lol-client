export const namespaced = true

export const state = () => ({
  kStats: [
    [5008, 5005, 5007],
    [5008, 5002, 5003],
    [5001, 5002, 5003]
  ],
  runes: null,
  runesOpen: false,
  selectedRunes: {}
})

export const mutations = {
  DISPLAY_HIDE_RUNES(state, selectedRunes) {
    state.runesOpen = !state.runesOpen
    state.selectedRunes = selectedRunes
  },
  SET_RUNES(state, runes) {
    state.runes = runes
  }
}

export const actions = {
  displayOrHideRunes({ commit }, selectedRunes) {
    commit('DISPLAY_HIDE_RUNES', selectedRunes)
  },
  async getRunes({ commit, getters, rootState }) {
    if (getters.runesLoaded) { return }

    const resp = await this.$axios.$get('cdragon/runes')
    //console.log(data)
    commit('SET_RUNES', resp)
  }
}

export const getters = {
  runesLoaded: state => state.runes
}
