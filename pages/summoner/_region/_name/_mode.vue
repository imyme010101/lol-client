<template>
  <div>
    <template v-if="$device.isDesktop">
      <div 
        v-if="summonerFound == false || overviewLoaded == false"
      >
        <OverviewLoader />
      </div>
      <div
        v-else
        key="overview"
        class="relative flex items-start justify-between text-center"
      >
        <div
          class="z-40 w-3/12"
        >
          <SummonerScore
            :matches="overview.matches"
          />

          <SummonerMates />
        </div>
        <div class="w-9/12 pl-4">
          <div>
            <SummonerStats @setMetaStats="setMetaStats" />
            <div class="flex justify-end items-end">
              <div class="flex mt-2 text-sm gap-2 text-white font-bold">
                <Tooltip>
                  <template #trigger>
                    <div class="bg-c-1 px-2 py-2 leading-none">
                      MVP
                    </div>
                  </template>
                  <template #default>
                    <div class="px-2 text-xs text-center">
                      승리팀 안에서 kda 및 딜량 1위
                    </div>
                  </template>
                </Tooltip>
                <Tooltip>
                  <template #trigger>
                    <div class="bg-sky-600 px-2 py-2 leading-none">
                      ACE
                    </div>  
                  </template>
                  <template #default>
                    <div class="px-2 text-xs text-center">
                      패배팀 안에서 kda 및 딜량 1위
                    </div>
                  </template>
                </Tooltip>
                <Tooltip>
                  <template #trigger>
                    <div class="bg-teal-600 px-2 py-2 leading-none">
                      시야왕
                    </div>
                  </template>
                  <template #default>
                    <div class="px-2 text-xs text-center">
                      시야 확보에 진심인 소환사
                    </div>
                  </template>
                </Tooltip>
                <Tooltip>
                  <template #trigger>
                    <div class="bg-purple-600 px-2 py-2 leading-none">
                      리신왕
                    </div>
                  </template>
                  <template #default>
                    <div class="px-2 text-xs text-center">
                      시야 확보 그런거 나 몰라 소환사
                    </div>
                  </template>
                </Tooltip>
              </div>
            </div>
          
            <Match
              :matches="overview.matches"
            />
            
            <LoadingButton
              v-if="overview.moreMatchesToFetch && currentgamemode == null"
              @clicked="moreMatches"
              :loading="matchesLoading"
              btn-class="w-full block px-4 py-2 mx-auto mt-4 font-semibold text-sm text-c-3 bg-white border border-gray-300 rounded-sm rounded-md"
            >더보기</LoadingButton>
          </div>
        </div>
      </div>
    </template>
    <template v-if="$device.isMobile">
      <div 
        v-if="summonerFound == false || overviewLoaded == false"
      >
        <OverviewLoader />
      </div>
      <div
        v-else
        key="overview"
        class="relative flex flex-col items-start justify-between text-center"
      >
        <div
          :top-spacing="48"
          :bottom-spacing="123"
          class="flex flex-col w-full"
        >
          <SummonerRanked
            v-if="Object.entries(ranked).length !== 0"
            :ranked="ranked"
          />
          <SummonerScore
            class="mt-2"
            :matches="overview.matches"
          />
          <SummonerChampions />
          
          <SummonerStats @setMetaStats="setMetaStats" />
        </div>
        
        
        <Match
          :matches="overview.matches"
        />
        
        <LoadingButton
          v-if="overview.moreMatchesToFetch && currentgamemode == null"
          @clicked="moreMatches"
          :loading="matchesLoading"
          btn-class="w-full flex px-4 py-2 mx-auto mt-4 font-semibold text-sm text-c-3 bg-white border border-gray-300 rounded-sm rounded-md"
        >더보기</LoadingButton>
        
      </div>
    </template>
  </div>
</template>


<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import LoadingButton from '@/components/Form/LoadingButton.vue'
import Match from '@/components/Match/Match.vue'
import OverviewLoader from '@/components/Common/Loader.vue'
import SummonerScore from '@/components/Summoner/Overview/SummonerScore.vue'
import SummonerChampions from '@/components/Summoner/Overview/SummonerChampions.vue'
import SummonerMates from '@/components/Summoner/Overview/SummonerMates.vue'
import SummonerStats from '@/components/Summoner/Overview/SummonerStats.vue'
import SummonerRanked from '@/components/Summoner/SummonerRanked.vue'

import Tooltip from '@/components/Common/Tooltip.vue'

export default {
  components: {
    LoadingButton,
    Match,
    OverviewLoader,
    SummonerScore,
    SummonerChampions,
    SummonerMates,
    SummonerStats,
    SummonerRanked,
    Tooltip
  },
  data: () => ({
    metaStats: ''
  }),
  computed: {
    ...mapState({
      account: state => state.summoner.basic.account,
      ranked: state => state.summoner.basic.ranked,
      currentgamemode: state => state.summoner.basic.currentGameMode,
      overview: state => state.summoner.overview,
    }),
    ...mapGetters('summoner', ['matchesLoading', 'overviewLoaded', 'summonerFound'])
  },

  watch: {
    $route(to, from) {
      if (from.params.mode === to.params.mode)
        return

      this.overviewRequest(to.params.mode)
    },
  },

  async asyncData({ store, params }) {
    if(store.state.summoner.basic.account.name !== params.name) {
      await store.dispatch('summoner/basicRequest', { summoner: params.name, region: params.region })
    }
    
    if (!store.state.summoner.overview.loaded && store.state.summoner.basic.status === 'found') {
      await store.dispatch('summoner/overviewRequest', params.mode)
    }
  },
  
  methods: {
    setMetaStats(value) {
      this.metaStats = value
    },

    ...mapActions('summoner', ['moreMatches', 'overviewRequest', 'sliceOverviewMatches'])
  },

  head() {
    return {
      title: (this.$store.state.summoner.basic.status === 'found' ? `${this.account.name}` : `sss`) + ` - 소환사 정보 | ${process.env['SITE_TITLE_FIX']}`,
      meta: [
        { hid: 'title', name: 'title', content: (this.$store.state.summoner.basic.status === 'found' ? `${this.account.name}` : ``) + ` - 소환사 정보 | ${process.env.SITE_TITLE_FIX}` },
        { hid: 'description', name: 'description', content: this.$store.state.summoner.basic.status === 'found' ? `소환사: ${this.account.name} 레벨: ${this.account.summonerLevel}, 솔로랭크: ${this.ranked.soloQ.fullRank}, 자유랭크: ${this.ranked.flex5v5.fullRank}, ${this.metaStats} 평가 되었습니다.` : `소환사를 찾을 수 없습니다.` },

        { hid: 'og:title', name: 'og:title', content: (this.$store.state.summoner.basic.status === 'found' ? `${this.account.name}` : ``) + ` - 소환사 정보 | ${process.env.SITE_TITLE_FIX}` },
        { hid: 'og:description', name: 'og:description', content: this.$store.state.summoner.basic.status === 'found' ? `소환사: ${this.account.name} 레벨: ${this.account.summonerLevel}, 솔로랭크: ${this.ranked.soloQ.fullRank}, 자유랭크: ${this.ranked.flex5v5.fullRank}, ${this.metaStats} 평가 되었습니다.` : `소환사를 찾을 수 없습니다.` },
        
        { hid: 'og:site_name', property: 'og:site_name', content: process.env.SITE_NAME },
        { hid: 'og:url', property: 'og:url', content: `https://zem.gg/summoner/${this.$route.params.region}/${this.$route.params.name}` },

        { hid: 'og:image', property: 'og:image', content: `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${this.account.profileIconId}.jpg` },
      ],
      link: [
        { rel: 'canonical', href: `https://zem.gg/summoner/${this.$route.params.region}/${this.$route.params.name}` }
      ]
    }
  }
}
</script>

<style scoped>
.sidebar {
  width: 300px;
}
</style>