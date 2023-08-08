<template>
  <div class="px-2 py-2">
    <template v-if="$device.isDesktop">
      <div class="relative z-10 w-full">
        <template v-if="summonerLoading || summonerFound">
          <div class="">
            <div class="flex items-center justify-between w-full">
              <nuxt-img :src="`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${basic.account.profileIconId}.jpg`" format="webp" width="80" height="80" class="rounded-lg" />
              
              <div class="flex flex-col ml-2 flex-1">
                <div class="flex items-center justify-between w-full">
                  <div
                    class="text-xs text-c-3 font-gong"
                  >레벨 {{ basic.account.summonerLevel }}</div>

                  <div class="flex ml-4 mb-1">
                    <button
                      @click.prevent="toggleFavorite({name: basic.account.name, icon: basic.account.profileIconId, region: $route.params.region})" 
                      :class="isFavorite(basic.account.name) ? 'border-c-3 bg-c-3 text-white' : 'bg-white border-c-0 text-c-0'"
                      class="flex items-center px-2 py-1 text-xs rounded-sm border cursor-pointer select-none"
                    >
                      <svg
                        class="w-3p5 h-3p5"
                      >
                        <use xlink:href="#star" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <h2 class="flex items-end font-bold">
                  <span class="text-5xl font-gong text-c-3">{{ basic.account.name[0] }}</span>
                  <span class="text-3xl font-gong text-c-0">{{ basic.account.name.substring(1) }}</span>
                </h2>
              </div>
            </div>
          </div>
        </template>
      </div>
    </template>

    <template v-if="$device.isMobile">
      <div class="relative z-10 w-full">
        <template v-if="summonerLoading || summonerFound">
          <div class="">
            <div class="flex items-center justify-between w-full">
              <nuxt-img :src="`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${basic.account.profileIconId}.jpg`" format="webp" width="80" height="80" class="rounded-lg" />
              
              <div class="flex flex-col ml-2 flex-1">
                <div class="flex items-center justify-between w-full">
                  <div
                    class="text-xs text-c-3 font-gong"
                  >레벨 {{ basic.account.summonerLevel }}</div>

                  <div class="flex ml-4 mb-1">
                    <button
                      @click.prevent="toggleFavorite({name: basic.account.name, icon: basic.account.profileIconId, region: $route.params.region})" 
                      :class="isFavorite(basic.account.name) ? 'border-c-3 bg-c-3 text-white' : 'bg-white border-c-0 text-c-0'"
                      class="flex items-center px-2 py-1 text-xs rounded-sm border cursor-pointer select-none"
                    >
                      <svg
                        class="w-3p5 h-3p5"
                      >
                        <use xlink:href="#star" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <h2 class="flex items-end font-bold">
                  <span class="text-5xl font-gong text-c-3">{{ basic.account.name[0] }}</span>
                  <span class="text-3xl font-gong text-c-0">{{ basic.account.name.substring(1) }}</span>
                </h2>
              </div>
            </div>
          </div>
        </template>
      </div>
    </template>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  components: {
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
    ...mapActions('summoner', ['basicRequest']),
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
  color: #4e41db;
  border-bottom: 2px solid #4e41db;
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
