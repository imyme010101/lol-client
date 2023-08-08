<template>
  <div key="live-game" class="mt-6">
    <div v-if="playing || summonerLoading">
      <div v-if="liveLoaded" class="flex flex-col">
        <div class="flex items-center justify-end -mt-4 text-base text-teal-600">
          <div>{{ gamemode.type }} {{ gamemode.name }}</div>
          <div class="mx-2">-</div>
          <div :class="{'w-12': displayStartTime !== '게임 사작전'}">{{ displayStartTime }}</div>
          <button
            @click="liveMatchRequest"
            class="flex items-center px-2 py-1 rounded-sm bg-teal-200 border border-red-400 text-red-500"
          >Reload</button>
        </div>
        <div class="flex gap-2 mt-2">
          <LiveTeam :team="allyTeam" :ally="true" :gamemode="gamemode.name" />
          <LiveTeam :team="enemyTeam" :ally="false" :gamemode="gamemode.name" />
        </div>
      </div>
      <div v-else>
        <LiveLoader />
      </div>
    </div>
    <div v-else>
      <div class="bg-white border border-teal-600 rounded-sm shadow-sm text-teal-600">
        <div class="flex flex-col items-center py-4">
          <span><b>'{{ $route.params.name }}'</b>님은 게임중이 아닙니다.</span>
          <span>현재 게임중이라면 다시 시도해주세요.</span>
          <span>('Bot'은 RiotAPI에서 인게임 정보를 가져올 수 없습니다.</span>
          <div class="py-4 text-2xl font-bold">ʢ´• ᴥ •`ʡ</div>
        </div>
      </div>
    </div>
  </div>
  
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import { liveGame } from '@/mixins/liveGame'
import LiveTeam from '@/components/Summoner/Live/LiveTeam.vue'
import LiveLoader from '@/components/Common/Loader.vue'

export default {
  components: {
    LiveTeam,
    LiveLoader
  },

  mixins: [liveGame],

  computed: {
    ...mapGetters('summoner', ['summonerLoading', 'summonerFound']),
    ...mapState({
      live: state => state.summoner.live.match,
      liveLoaded: state => state.summoner.live.liveLoaded,
      playing: state => state.summoner.live.playing,
    })
  },

  watch: {
    summonerFound() {
      this.fetchData()
    }
  },

  created() {
    this.fetchData()
  },

  methods: {
    fetchData() {
      if (this.playing && !this.liveLoaded && this.summonerFound) {
        this.liveMatchRequest()
      }
    },
    ...mapActions('summoner', ['liveMatchRequest']),
  },

  metaInfo() {
    return {
      title: 'Summoner Live Game',
    }
  }
}
</script>
