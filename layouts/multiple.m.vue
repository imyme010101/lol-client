<template>
  <div class="relative z-20">
    <SVGContainer />
    <NotificationsContainer />
    <RunesContainer />

    <header
      class="fixed w-full z-20 px-4 text-gray-100 transition-colors duration-100 ease-in-out bg-c-0"
    >
      <div class="flex flex-col items-center">
        <h1 class="relative w-full">
          <a href="/" class="flex flex-col items-center justify-center text-c-3 py-2 px-3 rounded-sm">
            <span class="h-0 text-z">{{ title }}</span>
            <div
              class="logo text-c-1"
            >
              ZEM
            </div>
            <span class="text-xs text-c-2">zem.gg</span>
          </a>

          
          <div class="absolute right-0 top-0 flex justify-between mt-2">
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
        </h1>

        <div class="flex justify-between">
          <div class="flex">
            <nuxt-link
              :to="{ name: 'multiple-region-names', params: { region: selectedRegion }}"
              class="z-20 flex items-center justify-center px-4 py-2 text-xs font-bold gap-2 menu h-full"
              exact
            >
              <span>AI 멀티서치</span>
            </nuxt-link>
          </div>
          
          <!-- <nuxt-link
            :to="{ name: 'multiple-region-names', params: { region: selectedRegion }}"
            class="z-20 flex flex-col items-center justify-center w-full px-4 py-4 text-xs font-bold gap-2 menu"
          >
            <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold font-gong">
              M
            </div>
            <span>멀티 서치</span>
          </nuxt-link> -->
        </div>
          <!-- <nuxt-link
            :to="{ name: 'multiple', params: { region: $route.params.region }}"
            class="flex items-center justify-center text-teal-100 h-full px-4"
          >
            <img src="~/img/icon/multiple.svg" class="w-5 h-5 rounded-full bg-white flex items-center justify-center" />
            <span class="ml-2">소환사 멀티서치</span>
          </nuxt-link> -->
        <div
          class="w-full"
        >
          <SearchForm @formSubmit="redirect" :homepage="false" class="py-4" />
        </div>
      </div>
    </header>
    
    <div class="relative w-full bg-c-2 pt-40">
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