<template>
  <div>
    <div v-if="$device.isDesktop">
      <div class="flex flex-col">
        <div class="inline-flex text-xxs gap-4">
          <button type="button" class="pb-1 px-2" :class="{'border-b border-c-1': tab == 1}" v-on:click="tab = 1">솔로랭크</button>
          <button type="button" class="pb-1 px-2" :class="{'border-b border-c-1': tab == 2}" v-on:click="tab = 2">자유랭크</button>
        </div>
        <div class="w-60">
          <div
            v-show="tab == 1"
            class="flex justify-center items-center text-c-0 w-full"
          >
            <nuxt-img provider="cloudinary" :src="`https://zem.gg${ranked['soloQ'].rankImgLink}`" format="webp" width="100" />
            <div class="flex flex-col items-center justify-center flex-1">
              <div
                class="flex mt-1 text-2xl"
              >
                <span class="font-bold font-gong text-lg" :style="{color: colorBorder(ranked['soloQ'])}">{{ ranked['soloQ'].fullRank }}</span>
              </div>
              <div
                class="flex font-bold mt-2 text-sm"
              >
                <span class="">{{ ranked['soloQ'].wins }}</span>
                <span class="ml-1">승</span>
                <span class="ml-1">{{ ranked['soloQ'].losses }}</span>
                <span class="ml-1">패</span>
                <span 
                  :style="{color: colorBorder(ranked['soloQ'])}"
                  class="ml-1"
                >{{ ranked['soloQ'].leaguePoints }} LP</span>
              </div>
            </div>

          </div>

          <div
            v-show="tab == 2"
            class="flex justify-center items-center text-c-0 w-full"
          >
            <nuxt-img provider="cloudinary" :src="`https://zem.gg${ranked['flex5v5'].rankImgLink}`" format="webp" width="100" />
            <div class="flex flex-col items-center justify-center flex-1">
              <div
                class="flex mt-1 text-2xl"
              >
                <span class="font-bold font-gong text-lg" :style="{color: colorBorder(ranked['flex5v5'])}">{{ ranked['flex5v5'].fullRank }}</span>
              </div>
              <div
                class="flex font-bold mt-2 text-sm"
              >
                <span class="">{{ ranked['flex5v5'].wins }}</span>
                <span class="ml-1">승</span>
                <span class="ml-1">{{ ranked['flex5v5'].losses }}</span>
                <span class="ml-1">패</span>
                <span 
                  :style="{color: colorBorder(ranked['flex5v5'])}"
                  class="ml-1"
                >{{ ranked['flex5v5'].leaguePoints }} LP</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="$device.isMobile">
      <div class="flex justify-between gap-2">
        <div
          class="flex flex-col items-center w-1/2 border border-gray-300 rounded-sm rounded-md px-2 py-2"
        >
          <nuxt-img provider="cloudinary" :src="`https://zem.gg${ranked['soloQ'].rankImgLink}`" format="webp" width="60" height="60" />
          <div class="flex flex-col items-center justify-center flex-1">
            <div
              class="flex mt-1"
            >
              <span class="font-bold font-gong text-lg" :style="{color: colorBorder(ranked['soloQ'])}">{{ ranked['soloQ'].fullRank }}</span>
            </div>
            <div
              class="flex font-bold mt-2"
            >
              <span class="">{{ ranked['soloQ'].wins }}</span>
              <span class="ml-1">승</span>
              <span class="ml-1">{{ ranked['soloQ'].losses }}</span>
              <span class="ml-1">패</span>
              <span 
                :style="{color: colorBorder(ranked['soloQ'])}"
                class="ml-1"
              >{{ ranked['soloQ'].leaguePoints }} LP</span>
            </div>
          </div>

        </div>

        <div
          class="flex flex-col items-center w-1/2 border border-gray-300 rounded-sm rounded-md px-2 py-2"
        >
          <nuxt-img provider="cloudinary" :src="`https://zem.gg${ranked['flex5v5'].rankImgLink}`" format="webp" width="60" height="60" />
          <div class="flex flex-col items-center justify-center flex-1">
            <div
              class="flex mt-1"
            >
              <span class="font-bold font-gong text-lg" :style="{color: colorBorder(ranked['flex5v5'])}">{{ ranked['flex5v5'].fullRank }}</span>
            </div>
            <div
              class="flex font-bold mt-2"
            >
              <span class="">{{ ranked['flex5v5'].wins }}</span>
              <span class="ml-1">승</span>
              <span class="ml-1">{{ ranked['flex5v5'].losses }}</span>
              <span class="ml-1">패</span>
              <span 
                :style="{color: colorBorder(ranked['flex5v5'])}"
                class="ml-1"
              >{{ ranked['flex5v5'].leaguePoints }} LP</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'

export default {
  components: {
  },

  props: {
    ranked: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      tab: 1,
      currentDegree: 0,
      currentDegree2: 0,
      rankColors: {
        'Unranked': '#ffffff',
        'iron': '#574D4F',
        'bronze': '#8C523A',
        'silver': '#80989D',
        'gold': '#CD8837',
        'platinum': '#4E9996',
        'diamond': '#576BCE',
        'master': '#9D48E0',
        'grandmaster': '#CD4545',
        'challenger': '#F4C874',
      },
      selectedKey: Object.keys(this.ranked)[0]
    }
  },

  computed: {
    bo() {
      return this.selectedLeague.miniSeries.progress.split('')
    },
    leagueDegrees() {
      return (this.ranked['soloQ'].leaguePoints <= 100 ? this.ranked['soloQ'].leaguePoints : 100) * 360 / 100
    },
    leagueDegrees2() {
      return (this.ranked['flex5v5'].leaguePoints <= 100 ? this.ranked['flex5v5'].leaguePoints : 100) * 360 / 100
    },
    selectedLeague() {
      return this.ranked[this.selectedKey]
    },
    
    ...mapGetters('summoner', ['playing', 'overviewLoaded', 'summonerFound', 'summonerNotFound', 'summonerLoading'])
  },

  // watch: {
  //   selectedKey() {
  //     this.currentDegree = 0
  //     this.currentDegree2 = 0
  //     this.$refs.leagueBorder.style.backgroundImage = null
  //     this.$refs.leagueBorder2.style.backgroundImage = null
  //     this.triggerAnimation()
  //     this.triggerAnimation2()
  //   }
  // },

  mounted() {
    this.triggerAnimation()
    this.triggerAnimation2()
  },

  methods: {
    colorBorder(tiers) {
      if (!tiers || tiers.leaguePoints === 0) {
        return '#a8a29e'
      }
      return this.rankColors[tiers.tier.toLowerCase()]
    },
    animateLeagueDegrees(stop = false) {
      if (stop || !this.$refs.leagueBorder) return
      this.ranked['soloQ'].leaguePoints > 50 ? this.currentDegree += 2 : this.currentDegree++
      
      const linearGradient = this.currentDegree <= 180 ? `linear-gradient(${90 + this.currentDegree}deg, transparent 50%, #a8a29e 50%)` : `linear-gradient(${this.currentDegree - 90}deg, transparent 50%, ${this.colorBorder(this.ranked['soloQ'])} 50%)`
      this.$refs.leagueBorder.style.backgroundImage = `${linearGradient}, linear-gradient(90deg, #a8a29e 50%, transparent 50%)`

      this.triggerAnimation()
    },
    animateLeagueDegrees2(stop = false) {
      if (stop || !this.$refs.leagueBorder2) return
      this.ranked['flex5v5'].leaguePoints > 50 ? this.currentDegree2 += 2 : this.currentDegree2++
      
      const linearGradient2 = this.currentDegree2 <= 180 ? `linear-gradient(${90 + this.currentDegree2}deg, transparent 50%, #a8a29e 50%)` : `linear-gradient(${this.currentDegree2 - 90}deg, transparent 50%, ${this.colorBorder(this.ranked['flex5v5'])} 50%)`
      this.$refs.leagueBorder2.style.backgroundImage = `${linearGradient2}, linear-gradient(90deg, #a8a29e 50%, transparent 50%)`

      this.triggerAnimation2()
    },
    boGame(result) {
      switch (result) {
        case 'W':
          return 'bg-green-400'
        case 'L':
          return 'bg-red-400'
        default:
          return 'bg-teal-200'
      }
    },
    triggerAnimation() {
      setTimeout(() => {
        if (this.currentDegree < 360 && this.currentDegree < this.leagueDegrees)
          this.animateLeagueDegrees()
        else
          this.animateLeagueDegrees(true)
      }, 1)
    },
    triggerAnimation2() {
      setTimeout(() => {
        if (this.currentDegree2 < 360 && this.currentDegree2 < this.leagueDegrees2)
          this.animateLeagueDegrees2()
        else
          this.animateLeagueDegrees2(true)
      }, 1)
    }
  }
}
</script>
