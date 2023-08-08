<template>
  <div class="border border-gray-300 rounded-sm rounded-md px-2 py-2 mt-2">
    <div class="relative flex items-center justify-center py-1 bg-gray-200 rounded-md mb-2">
      <h2 class="mx-4 text-sm font-bold uppercase">
        <span class="text-sm pr-1">･ᴥ･</span>같은 팀으로 게임한 소환사
      </h2>
    </div>
    <div v-if="hasMates" class="text-left">
      <div class="flex items-baseline text-xs font-semibold uppercase bg-gray-100 py-2 px-2">
        <div class="w-3/6">소환사</div>
        <div class="w-1/6 text-center">게임</div>
        <div class="w-1/6 text-center">승패</div>
        <div class="w-1/6 text-right">승률</div>
      </div>
      <ul class="mt-1 pb-2 px-2 text-xs">
        <li
          v-for="mate in mates.slice(0, maxMates)"
          :key="mate.name"
          class="flex items-center justify-between"
        >
          <nuxt-link
            :to="{ name: 'summoner-region-name-mode', params: { region: $route.params.region, name: mate.name.replace(' ', '') }}"
            class="w-3/6 overflow-hidden whitespace-nowrap text-overflow text-left"
          >{{ mate.name }}</nuxt-link>
          <div class="w-1/6 text-center">{{ mate.count }}</div>
          <div class="w-1/6 text-center"><span class="text-teal-600">{{ mate.wins }}</span> - <span class="text-red-600">{{ mate.losses }}</span></div>
          <div class="w-1/6 text-right">
            {{ winrate(mate.wins, mate.count)|round(1) }}%
          </div>
        </li>
      </ul>
    </div>
    <div v-else class="px-4 py-2">
      <div class="py-4">최근 기록이 없어요.</div>
      <div class="py-4 text-2xl font-bold">ʢ´• ᴥ •`ʡ</div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  components: {
  },

  data() {
    return {
      maxMates: 15
    }
  },

  computed: {
    hasMates() {
      return this.mates.length > 0
    },
    ...mapState({
      mates: state => state.summoner.overview.stats.mates
    }),
  },

  methods: {
    getWinrateColor(wins, count, background = true) {
      const winrate = this.winrate(wins, count)
      if (winrate >= 70) {
        return background ? 'bg-yellow-400' : 'text-yellow-400'
      } else if (winrate >= 60) {
        return background ? 'bg-teal-500' : 'text-blue-500'
      } else if (winrate >= 50) {
        return background ? 'bg-blue-300' : 'text-blue-300'
      }

      return background ? 'bg-blue-200' : 'text-blue-200'
    },
    winrate(wins, count) {
      return wins * 100 / count
    }
  }
}
</script>
