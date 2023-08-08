<template>
  <div class="relative flex flex-col z-20 bg-c-2">
    <SVGContainer />
    <NotificationsContainer />
    <RunesContainer />

    <header
      class="fixed w-full z-20 px-10 text-gray-100 transition-colors duration-100 ease-in-out bg-c-0"
    >
      <div class="flex items-center h-16 gap-8">
        <h1>
          <a href="/" class="flex flex-col items-center justify-center text-c-3 py-2 px-3 rounded-sm">
            <span class="h-0 text-z">{{ title }}</span>
            <div
              class="logo text-c-1"
            >
              ZEM
            </div>
            <span class="text-xs text-c-2">zem.gg</span>
          </a>
        </h1>

        <div class="flex justify-between flex-1 h-full">
          <div class="flex">
            <nuxt-link
              to="/"
              class="z-20 flex items-center justify-center px-4 text-sm font-bold gap-2 menu h-full"
              exact
            >
              <span>홈</span>
            </nuxt-link>
          </div>
          
          <div class="flex justify-between h-full">
            <a
              href="https://discord.gg/W76QeWsPCM"
              target="_blank"
              class="z-20 flex items-center justify-center text-sm font-bold gap-2 h-full"
            >
              <div class="flex items-center justify-center">
                <nuxt-img :src="`https://zem.gg/img/Discord.png`" format="webp" width="32" height="28" class="w-8 h-6" />
              </div>
              디코 참여
            </a>
          </div>
        </div>
        
      </div>
    </header>
    

    <div class="relative w-full">
      <nuxt />
      <MainFooter />
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import NotificationsContainer from '@/components/Global/NotificationsContainer.vue'
import RunesContainer from '@/components/Match/Runes/RunesContainer.vue'
import SVGContainer from '@/components/Global/SVGContainer.vue'
import MainFooter from '@/components/Layout/MainFooter.vue'

export default {
  components: {
    NotificationsContainer,
    RunesContainer,
    SVGContainer,
    MainFooter
  },

  computed: {
    title() {
      return '롤 전적 검색 ZEM.GG | 소환사 인분, 소환사 등급 확인'
    },
    ...mapState({
      basic: state => state.summoner.basic,
      current: state => state.summoner.live.match,
      favorites: state => state.settings.favorites,
      selectedRegion: state => state.settings.region
    }),
  },
  

  beforeMount() {
    this.updateSettings({name: 'region'})
    this.updateSettings({name: 'recentSearches', isJson: true})
    this.updateSettings({name: 'favorites', isJson: true})
  },

  methods: {
    ...mapActions('settings', ['updatePercent', 'updateSettings'])
  }
}
</script>

<style scoped>
.menu {
  border-bottom: 4px solid transparent;
}


.nuxt-link-active {
  border-bottom: 4px solid #ff9600;
      color: #ff9600;
}

.logo {
  letter-spacing: 3px;
  display: inline;
  font-size: 1em;
  line-height: 100%;
  font-weight: bold;
  font-family: 'GongGothicBold';
}
</style>