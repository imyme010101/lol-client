<template>
  <div class="border border-gray-300 rounded-sm rounded-md px-2 py-2 mt-2">
    <div class="relative flex items-center justify-center py-1 bg-gray-200 mb-2">
      <h2 class="mx-4 text-sm font-bold uppercase">
        <span class="text-sm pr-1">･ᴥ･</span>TOP 5 챔피언
      </h2>
    </div>
    <div v-if="stats.champion.length">
      <ul class="text-left">
        <li
          v-for="(champion, index) in stats.champion"
          :key="index"
          :class="[{'': index % 2 === 0}]"
          class="relative flex items-center px-2 py-2 leading-tight"
        >
          <div class="w-6/12 flex items-center">
            <div
              class="w-8 h-8 bg-center bg-cover bg-teal-800 rounded-full flex-shrink-0"
            >
              <nuxt-img :src="`${champion.champion.icon}`" format="webp" width="40" height="40" class="rounded-full" />
            </div>
            <div class="flex flex-col ml-2 text-xs font-bold truncate">
              <div>{{ champion.champion.name }}</div>
            </div>
          </div>
          <div
            class="w-4/12 text-center"
            :class="classKda(kda(champion.kills, champion.deaths, champion.assists), 'text')"
          >
            <div
              class="text-xs font-bold"
            >{{ kda(champion.kills, champion.deaths, champion.assists) }} 평점</div>
            <div class="text-xxs">{{ (champion.kills / champion.count)|round(1) }} / {{ (champion.deaths / champion.count)|round(1) }} / {{ (champion.assists / champion.count)|round(1) }}</div>
          </div>
          <div
            class="w-2/12 text-center"
            :class="classWin((champion.wins * 100 / champion.count), 'text')"
          >
            <div class="text-xs font-bold">{{ champion.wins * 100 / champion.count|percent }}</div>
            <div class="text-xxs">{{ champion.count }} 게임</div>
          </div>
        </li>
      </ul>
    </div>
    <div v-else class="px-4 py-2">
      <div class="py-4">최근 플레이한 챔피언 기록이 없어요.</div>
      <div class="py-4 text-2xl text-bell-500 font-bold">ʢ´• ᴥ •`ʡ</div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
// import Tooltip from '@/components/Common/Tooltip.vue'

export default {
  components: {
    // Tooltip,
  },

  computed: {
    bestKda() {
      const bestChamp = this.stats.champion.reduce((a, b) => {
        return this.kda(a.kills, a.deaths, a.assists) > this.kda(b.kills, b.deaths, b.assists) ? a : b
      })
      return this.kda(bestChamp.kills, bestChamp.deaths, bestChamp.assists)
    },
    mostPlayed() {
      return this.stats.champion.reduce((a, b) => a.count > b.count ? a : b).count
    },
    ...mapState({
      stats: state => state.summoner.overview.stats
    }),
  },

  methods: {
    classKda(kda, type) {
      if(kda < 1) {
        return type + '-red-500'
      } else if(kda >= 2 && kda < 3) {
        return type + '-teal-500'
      } else if(kda >= 3) {
        return type + '-teal-700'
      }
    },
    classWin(win, type) {
      if(win < 50) {
        return type + '-red-500'
      } else if(win >= 50 && win < 80) {
        return type + '-teal-500'
      } else if(win >= 80) {
        return type + '-teal-700'
      }
    },
    kda(kills, deaths, assists) {
      if (kills === 0 && deaths === 0 && assists === 0) {
        return 0
      }
      return this.$options.filters.round((kills + assists) / deaths)
    },
    widthBar(value, total) {
      return `${value * 36 / total}px`
    }
  }
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
