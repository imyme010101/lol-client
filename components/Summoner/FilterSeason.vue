<template>
  <div class="relative flex items-center justify-between border border-gray-300 rounded-sm rounded-md pt-5 px-3">
    <div class="inline-flex text-xs gap-4">
      <nuxt-link
        :to="{ name: 'summoner-region-name-mode', params: { region: $route.params.region, name: $route.params.name }}"
        class="fillter-menu"
      >
        전체
      </nuxt-link>
      <nuxt-link
        :to="{ name: 'summoner-region-name-mode', params: { region: $route.params.region, name: $route.params.name, mode: 420 }}"
        class="fillter-menu"
      >
        솔랭
      </nuxt-link>
      <nuxt-link
        :to="{ name: 'summoner-region-name-mode', params: { region: $route.params.region, name: $route.params.name, mode: 440 }}"
        class="fillter-menu"
      >
        자유랭크
      </nuxt-link>
      <nuxt-link
        :to="{ name: 'summoner-region-name-mode', params: { region: $route.params.region, name: $route.params.name, mode: 430 }}"
        class="fillter-menu"
      >
        일반
      </nuxt-link>
      <nuxt-link
        :to="{ name: 'summoner-region-name-mode', params: { region: $route.params.region, name: $route.params.name, mode: 450 }}"
        class="fillter-menu"
      >
        칼바람
      </nuxt-link>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  data() {
    return {
      season: null,
      gamemode: null
    }
  },

  computed: {
    sortedSeasons() {
      return [...this.seasons].sort((a, b) => b - a)
    },
    ...mapState({
      currentseason: state => state.summoner.basic.currentSeason,
      currentgamemode: state => state.summoner.basic.currentGameMode,
      seasons: state => state.summoner.basic.seasons,
    }),
  },

  created() {
    this.season = this.currentseason
    this.gamemode = this.currentgamemode
  },

  watch: {
    $route(to, from) {
      if (to.params.gamemode != from.params.gamemode) {
        this.updateSeason(this.season, this.gamemode)
      }
    }
  },

  methods: {
    filterSeason() {
      this.updateSeason(this.season, this.gamemode)
    },
    ...mapActions('summoner', ['updateSeason'])
  }
}
</script>

<style scoped>
.fillter-menu {
  position: relative;
  display: block;
  padding: 0 3px;
  font-size: 16px;
  line-height: 19px;
  font-weight: 600;
  color: #a0a5b6;
}
.fillter-menu.nuxt-link-exact-active {
  padding: 0 5px 10px;
  font-size: 17px;
  line-height: 20px;
  color: #4e41db;
  border-bottom: 2px solid #4e41db;
}
</style>