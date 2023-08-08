<template>
  <div
    :class="{'page-wrapper mx-auto': $device.isDesktop}"
  >
    <div
      v-if="!summonerFound && summonerNotFound"
      class="mx-auto py-20 text-center text-c-0"
    >
      <h2 class="text-lg py-4">ZEM.GG에 등록되지 않은 소환사입니다. 오타를 확인 후 다시 검색해주세요.</h2>
      <div>
        ʢ´• ᴥ •`ʡ
      </div>
    </div>
    <div v-else>
      <template v-if="$device.isDesktop">
        <div class="relative z-10 w-full">
          <template v-if="summonerLoading || summonerFound">
            <div class="flex flex-col items-start mt-4 p-2">
              
              <template v-if="summonerLoading">
                <HeaderLoader />
              </template>
              <template v-else-if="summonerFound">
                <div class="flex justify-between items-center w-full">
                
                  <SummonerInfo />
                      
                  <SummonerRanked
                    v-if="Object.entries(ranked).length !== 0"
                    :ranked="ranked"
                    class=""
                  />
                </div>

                <!-- NAVIGATION -->
                <div class="flex gap-2 text-c-0 mt-4">
                  <nuxt-link
                    :to="{ name: 'summoner-region-name-mode', params: { region: $route.params.region, name: $route.params.name }}"
                    :class="{'nuxt-link-exact-active nuxt-link-active': $route.params.mode}"
                    class="top-menu"
                    exact
                  >종합</nuxt-link>
                  <nuxt-link
                    :to="{ name: 'summoner-region-name-champions', params: { region: $route.params.region, name: $route.params.name }}"
                    class="top-menu"
                    exact
                  >챔피언</nuxt-link>
                  <nuxt-link
                    :to="{ name: 'summoner-region-name-records', params: { region: $route.params.region, name: $route.params.name }}"
                    class="top-menu"
                    exact
                  >챔피언 기록실</nuxt-link>
                  <!-- <router-link
                    :to="{ name: 'summonerLive', params: { region: $route.params.region, name: $route.params.name }}"
                    :class="isRouteActive('summonerLive')"
                    class="text-white cursor-pointer px-3 py-1 rounded-sm"
                    exact
                  >인게임 정보</router-link> -->
                </div>
              </template>

            </div>
          </template>
        </div>

        <div
          class="relative z-10"
        >
          <!-- View -->
          <transition :name="tabTransition">
            <nuxt />
          </transition>
        </div>
      </template>

      <template v-if="$device.isMobile">
        <div class="relative z-10 w-full">
          <template v-if="summonerLoading || summonerFound">
            <template v-if="summonerLoading">
              <HeaderLoader />
            </template>
            <template v-else-if="summonerFound">
              <SummonerInfo />
              
              <div class="flex items-center justify-between mt-4 p-2">
                <!-- NAVIGATION -->
                <div class="flex gap-2 text-c-0">
                  <nuxt-link
                    :to="{ name: 'summoner-region-name-mode', params: { region: $route.params.region, name: $route.params.name }}"
                    :class="{'nuxt-link-exact-active nuxt-link-active': $route.params.mode}"
                    class="top-menu"
                    exact
                  >종합</nuxt-link>
                  <nuxt-link
                    :to="{ name: 'summoner-region-name-champions', params: { region: $route.params.region, name: $route.params.name }}"
                    class="top-menu"
                    exact
                  >챔피언</nuxt-link>
                  <nuxt-link
                    :to="{ name: 'summoner-region-name-records', params: { region: $route.params.region, name: $route.params.name }}"
                    class="top-menu"
                    exact
                  >챔피언 기록실</nuxt-link>
                  <!-- <router-link
                    :to="{ name: 'summonerLive', params: { region: $route.params.region, name: $route.params.name }}"
                    :class="isRouteActive('summonerLive')"
                    class="text-white cursor-pointer px-3 py-1 rounded-sm"
                    exact
                  >인게임 정보</router-link> -->
                </div>

              </div>
            </template>
          </template>
        </div>

        <div
          class="relative z-10w-full mx-auto mt-3 mb-8"
        >
          <!-- View -->
          <transition :name="tabTransition">
            <nuxt />
          </transition>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'

import HeaderLoader from '@/components/Summoner/HeaderLoader.vue'
import SummonerInfo from '@/components/Summoner/SummonerInfo.vue'
import SummonerRanked from '@/components/Summoner/SummonerRanked.vue'

export default {
  layout: (ctx) => ctx.$device.isDesktop ? 'default' : 'default.m',
  
  components: {
    HeaderLoader,
    SummonerInfo,
    SummonerRanked
  },

  data() {
    return {
      bgHeader: false
    }
  },

  computed: {
    title() {
      return this.summonerFound ? `${this.basic.account.name} | 소환사 전적 검색, 인분 검색, 등급 검색 ZEM.GG` : `${this.$route.params.name} |  소환사 전적 검색, 인분 검색, 등급 검색 ZEM.GG`
    },
    tabTransition() {
      return this.summonerFound && this.overviewLoaded ? 'tab' : 'none'
    },
    ...mapState({
      basic: state => state.summoner.basic,
      ranked: state => state.summoner.basic.ranked,
      current: state => state.summoner.live.match,
      favorites: state => state.settings.favorites,
    }),
    ...mapGetters('summoner', ['playing', 'overviewLoaded', 'summonerFound', 'summonerNotFound', 'summonerLoading'])
  },

  async asyncData({ store, params }) {
    await store.dispatch('cdragon/getRunes', {})
  },

  beforeMount() {
    this.updateSettings({ name: 'region', value: this.$route.params.region.toLowerCase() })
  },

  destroyed() {
    if(process.browser) {
      window.removeEventListener('scroll', this.handleScroll)
    }
  },

  methods: {
    handleScroll() {
      if(process.browser) {
        this.bgHeader = window.scrollY > 25
      }
    },
    isFavorite(name) {
      return this.favorites.some(s => s.name === name)
    },
    toggleFavorite(player) {
      this.updateFavorite(player)
    },
    ...mapActions('settings', ['updateSettings', 'updateFavorite']),
  }
}
</script>

<style scoped>
.top-menu {
  position: relative;
  display: block;
  padding: 0 3px;
  font-size: 16px;
  line-height: 19px;
  font-weight: 600;
  color: #a0a5b6;
}
.top-menu.nuxt-link-active {
  padding: 0 5px 10px;
  font-size: 17px;
  line-height: 20px;
  color: #ff9600;
  border-bottom: 2px solid #ff9600;
}

.header-scrolled {
  background-color: rgba(42, 67, 101, 0.95);
}
.discord svg {
  width: 22px;
  height: 22px;
  transform-origin: bottom left;
  transition: 0.2s ease-in-out;
}

.discord:hover svg {
  width: 24px;
  height: 24px;
  transform: rotate(-5deg);
}

.discord:hover span {
  color: #ebf8ff;
}
.playing {
  position: relative
}
.playing::after {
  content: "";
  position: absolute;
  height: 4.6rem;
  width: 4.6rem;
  top: -5px;
  left: -5px;
  right: 0;
  bottom: 0;
  border-radius: 50%;
}
.playing::after {
  z-index: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0) 30%,
    rgba(56, 178, 172, 0.8) 100%
  );
  animation: 0.75s linear 0s infinite normal none running rotate;
}


@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

.playing-dot {
  box-shadow: 0 0 0 0 rgba(0, 0, 0, 1);
  transform: scale(1);
  animation: 2.5s ease-in-out 0s infinite normal none running playing;
}
.playing-not-dot {
  box-shadow: 0 0 0 0 rgba(0, 0, 0, 1);
  transform: scale(1);
  animation: 2.5s ease-in-out 0s infinite normal none running playing-not;
}

@keyframes playing {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(232, 64, 87, 0.7);
  }

  70% {
    transform: scale(1);
    box-shadow: 0 0 0 8px rgba(0, 0, 0, 0);
  }

  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
  }
}
@keyframes playing-not {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(38, 38, 38, 0.7);
  }

  70% {
    transform: scale(1);
    box-shadow: 0 0 0 8px rgba(0, 0, 0, 0);
  }

  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
  }
}
</style>
