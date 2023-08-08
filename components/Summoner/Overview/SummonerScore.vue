<template>
  <div class="border border-gray-300 rounded-sm rounded-md px-2 py-2">
    <div class="relative flex items-center justify-center py-1 bg-gray-200 rounded-md mb-2">
      <h2 class="mx-4 text-sm font-bold uppercase">
        <span class="text-sm pr-1">･ᴥ･</span>최근 게임 인분
      </h2>
    </div>
    <div
      :class="[{'grid-cols-5 gap-2': $device.isDesktop, 'grid-cols-10 gap-2': $device.isMobile}]"
      class="grid grid-cols-5 gap-2"
    >
      <div
        v-for="(match, index) in matches.slice(0, 20)"
        :key="index"
        :class="[match.result, {'w-10': $device.isDesktop}, {'w-8': $device.isMobile}]"
        class="flex flex-col justify-center rounded-lg p-1"
      >
        <nuxt-img :src="`${match.champion.icon}`" format="webp" width="56" height="56" class="w-full rounded-lg" />
        <span class="mt-1 text-xxs font-bold">{{match.stats.inbun}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import { getSummonerScore, getSummonerScoreTotal } from '@/helpers/summoner'


export default {
  components: {
  },

  props: {
    matches: []
  },
  
  data: () => ({
    currentDegree: 0,
    currentDegree2: 0,
    currentDegree3: 0,
    currentDegree4: 0,
    summonerScores: {},
    currentDegree: {
      'kda': 0,
      'kills': 0,
      'assists': 0,
      'vision': 0,
      'total': 0
    }
  }),
  
  computed: {
    ...mapGetters('summoner', ['summonerFound']),
    ...mapState({
      mates: state => state.summoner.overview.stats.mates,
      tier: state => state.summoner.basic.ranked.soloQ.tier ? state.summoner.basic.ranked.soloQ.tier : state.summoner.basic.ranked.flex5v5.tier ? state.summoner.basic.ranked.flex5v5.tier : null,
      scores: state => state.summoner.basic.scores,
      scoresLoaded: state => state.summoner.scores.tierScoreLoaded,
    })
  },

  watch: {
    scoresLoaded() {
      this.fetchData()
    },
    summonerFound() {
      this.fetchData()
    }
  },

  created() {
    this.fetchData()
  },

  methods: {
    colorInbun(score, type) {
      if (score < 1.0) {
        return type + '-red-600'
      }else if (score >= 1.0 && score < 2.5) {
        return type + '-blue-600'
      } else {
        return type + '-purple-600'
      }
    },

    fetchData() {
      this.summonerScores['kda'] = getSummonerScore(this.matches, this.scores, this.tier, 'kda')
      this.summonerScores['assists'] = getSummonerScore(this.matches, this.scores, this.tier, 'assists')
      this.summonerScores['kills'] = getSummonerScore(this.matches, this.scores, this.tier, 'kills')
      this.summonerScores['vision'] = getSummonerScore(this.matches, this.scores, this.tier, 'vision')

      if(this.summonerScores['kda'] == null || this.summonerScores['assists'] == null || this.summonerScores['kills'] == null || this.summonerScores['vision'] == null) {
        this.summonerScores = null
      } else {
        this.summonerScores['total'] = getSummonerScoreTotal(this.summonerScores)
      }
    }
  },
}
</script>
<style scoped>
.w-champion {
  width: 110px;
}

.w-plays {
  width: 55px;
}

.w-winrate {
  width: 65px;
}

.w-kda {
  width: 36px;
}
</style>
