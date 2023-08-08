import { createMatchData, createBasicSummonerData, createRecordsData } from '@/helpers/summoner'

export const namespaced = true

export const state = () => ({
  basic: {
    account: {},
    currentSeason: null,
    currentGameMode: null,
    matchList: [],
    ranked: {},
    scores: {},
    recentActivity: [],
    seasons: [],
    gamemodes: [],
    status: ''
  },
  overview: {
    NB_LOAD_GAMES: 10,
    matches: [],
    stats: {},
    loaded: false,
    matchesLoading: false,
    moreMatchesToFetch: true
  },
  champions: {
    list: [],
    championsLoaded: false
  },
  records: {
    list: {},
    recordsLoaded: false
  },
  scores: {
    score: 0,
    tierScoreLoaded: false
  },
  live: {
    match: {},
    liveLoaded: false,
    playing: false
  }
})

export const mutations = {
  BASIC_REQUEST(state) {
    state.basic.status = 'loading'
    state.basic.currentSeason = null
    state.champions.championsLoaded = false
    state.records.recordsLoaded = false
    state.scores.tierScoreLoaded = false
    state.overview.loaded = false
    state.overview.moreMatchesToFetch = true
    state.live.liveLoaded = false
  },
  CHAMPIONS_NOT_FOUND(state) {
    state.champions.championsLoaded = false
  },
  CHAMPIONS_FOUND(state, { champions }) {
    state.champions.list = champions
    state.champions.championsLoaded = true
  },
  KEEP_LAST_X_MATCHES(state, number) {
    state.overview.matches = state.overview.matches.slice(0, number)
  },
  LIVE_FOUND(state, { live }) {
    state.live.match = live
    state.live.liveLoaded = true
  },
  LIVE_LOADING(state) {
    state.live.playing = true
    state.live.liveLoaded = false
  },
  MATCHES_LOADING(state) {
    state.overview.matchesLoading = true
  },
  MATCHES_FOUND(state, { newMatches, stats }) {
    state.overview.matchesLoading = false

    if (newMatches.length > 0) {
      state.basic.recentActivity = stats.recentActivity
      state.overview.matches = [...state.overview.matches, ...newMatches]
      state.overview.stats = stats
      state.champions.championsLoaded = false
      state.records.recordsLoaded = false
      state.scores.tierScoreLoaded = false
    }

    state.overview.moreMatchesToFetch = newMatches.length >= state.overview.NB_LOAD_GAMES - 1
  },
  OVERVIEW_FOUND(state, infos) {
    state.basic.recentActivity = infos.stats.recentActivity
    state.overview.matches = infos.matches
    state.overview.stats = infos.stats
    state.overview.loaded = true
    state.records.recordsLoaded = false
    state.scores.tierScoreLoaded = false
    state.overview.moreMatchesToFetch = infos.matches.length >= state.overview.NB_LOAD_GAMES - 1
  },
  RECORDS_FOUND(state, { records }) {
    state.records.list = records
    state.records.recordsLoaded = true
  },
  TIERSCORE_FOUND(state, { scores }) {
    state.scores = scores
    state.scores.tierScoreLoaded = true
  },  
  SUMMONER_FOUND(state, infos) {
    state.basic.account = infos.account
    state.basic.matchList = infos.matchList
    state.basic.ranked = infos.ranked
    state.basic.recentActivity = infos.recentActivity
    state.basic.scores = infos.scores
    state.basic.seasons = infos.seasons.sort((a, b) => b - a)
    state.basic.gamemodes = infos.gamemodes
    state.basic.status = 'found'
    state.live.match = infos.current
    state.live.playing = infos.playing
  },
  SUMMONER_NOT_FOUND(state) {
    state.basic.status = 'error'
  },
  SUMMONER_NOT_PLAYING(state) {
    state.live.match = {}
    state.live.playing = false
    state.live.liveLoaded = false
  },

  // UPDATE_SEASON(state, { season, gamemode }) {
  //   state.basic.currentSeason = season
  //   state.basic.currentGameMode = gamemode

  //   state.overview.loaded = false
  //   state.champions.championsLoaded = false
  //   state.records.recordsLoaded = false
  //   state.scores.tierScoreLoaded = false
  // },

  UPDATE_SEASON(state, { season, gamemode }) {
    state.basic.currentSeason = season
    state.basic.currentGameMode = gamemode

    state.overview.loaded = false
    state.champions.championsLoaded = false
    state.records.recordsLoaded = false
    state.scores.tierScoreLoaded = false
  }
}

export const actions = {
  async basicRequest({ commit, dispatch, rootState }, { summoner, region }) {
    const regionId = rootState.settings.regionsList[region]
    
    commit('BASIC_REQUEST')
    try {
      const resp = await this.$axios.$post('summoner/basic', { summoner, region: regionId })
      
      if (!resp) {
        // dispatch('notification/add', {
        //   type: 'error',
        //   message: 'Summoner not found.'
        // }, { root: true })
        return commit('SUMMONER_NOT_FOUND')
      }

      //console.log(`---SUMMONER INFOS ${resp.data.account.name}---`)
      
      const infos = createBasicSummonerData(resp)
      commit('SUMMONER_FOUND', infos)
      
      // Add summoner to recent searches
      dispatch('settings/addRecentSearch', {
        name: infos.account.name,
        icon: infos.account.profileIconId,
        region,
      }, { root: true })
    } catch (error) {
      // if (error.message !== 'Summoner changed') {
      //   commit('SUMMONER_NOT_FOUND')
      // }
    }
  },
  championsNotLoaded({ commit }) {
    commit('CHAMPIONS_NOT_FOUND')
  },
  async championsRequest({ commit, rootState }, queue = null) {
    const resp = await this.$axios.$post('summoner/champions', { puuid: rootState.summoner.basic.account.puuid, queue: queue })
    //console.log(`---CHAMPIONS---')
    //console.log(resp.data)

    commit('CHAMPIONS_FOUND', { champions: resp })
  },
  async liveMatchRequest({ commit, rootState }) {
    commit('LIVE_LOADING')
    const resp = await this.$axios.$post('summoner/live', { id: rootState.summoner.basic.account.id, region: rootState.settings.regionsList[rootState.settings.region] })

    //console.log(`---LIVE---')
    //console.log(resp.data)

    if (resp) {
      commit('LIVE_FOUND', { live: resp })
    } else {
      commit('SUMMONER_NOT_PLAYING')
    }
  },
  async moreMatches({ commit, rootState }) {
    commit('MATCHES_LOADING')

    if (!rootState.summoner.overview.matches.length) return
    const lastMatchId = rootState.summoner.overview.matches[rootState.summoner.overview.matches.length - 1].matchId

    const resp = await this.$axios.$post('match', { puuid: rootState.summoner.basic.account.puuid, region: rootState.settings.regionsList[rootState.settings.region], lastMatchId, queue: rootState.summoner.basic.currentGameMode ? rootState.summoner.basic.currentGameMode : '' })

    //console.log(`---MATCHES INFOS---')
    //console.log(resp.data)
    const newMatches = createMatchData(resp.matches, rootState.cdragon.runes)
    commit('MATCHES_FOUND', { newMatches, stats: resp.stats })
  },
  async overviewRequest({ commit, rootState }, gamemode = null) {
    const resp = await this.$axios.$post('summoner/overview', { puuid: rootState.summoner.basic.account.puuid, accountId: rootState.summoner.basic.account.accountId, region: rootState.settings.regionsList[rootState.settings.region], queue: gamemode ? String(gamemode) : '' })
    
    resp.matches = createMatchData(resp.matchesDetails, rootState.cdragon.runes)
    commit('OVERVIEW_FOUND', resp)
  },
  async recordsRequest({ commit, rootState }) {
    const resp = await this.$axios.$post('summoner/records', { puuid: rootState.summoner.basic.account.puuid })
    //console.log(`---RECORDS---')
    //console.log(resp.data)
    const records = resp.length ? createRecordsData(resp) : {}

    commit('RECORDS_FOUND', { records })
  },
  async scoresRequest({ commit, rootState }) {
    const resp = await this.$axios.$post('summoner/summonerscore', { puuid: rootState.summoner.basic.account.puuid, tier: rootState.summoner.basic.ranked.soloQ.tier })
    //console.log(`---TIERSCORE---')
    
    const scores = resp.summonerScores
    
    commit('TIERSCORE_FOUND', { scores })
  },  
  sliceOverviewMatches({ commit }, number) {
    commit('KEEP_LAST_X_MATCHES', number)
  },
  updateSeason({ commit }, season) {
    commit('UPDATE_SEASON', { season })
  }
}

export const getters = {
  matchesLoading: state => state.overview.matchesLoading,
  overviewLoaded: state => state.overview.loaded,
  playing: state => state.live.playing,
  regionFilterApplied: state => !!state.basic.currentSeason,
  summonerFound: state => state.basic.status === 'found',
  summonerNotFound: state => state.basic.status === 'error',
  summonerLoading: state => state.basic.status === 'loading',
}