<template>
  <div class="flex flex-col overflow-hidden text-xs rounded-sm mt-2">
    <!-- <div class="w-full flex items-center justify-center py-2">
      <span class="w-full flex items-center justify-center font-bold uppercase gap-2">
        소환사 <div class="">{{ gamemode.name }}</div> <div class="text-red-500">{{ displayStartTime }}</div>
      </span>
    </div> -->
    
    <div class="relative flex justify-between w-full overflow-hidden">
      <ul class="w-1/2 text-left">
        <li
          v-for="(ally, index) in allyTeam"
          :key="ally.summonerId"
          :class="index % 2 === 0 ? 'accent-ally' : 'ally'"
          class="flex items-center px-5 py-1 leading-loose text-overflow whitespace-nowrap"
        >
          <div
            :style="{backgroundImage: `url('https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${ally.championId}.png')`}"
            class="w-6 h-6 bg-center bg-cover rounded-full bg-white0"
          ></div>
          <nuxt-link
            v-if="!ally.bot"
            :to="{ name: 'summoner-region-name-mode', params: { region: $route.params.region, name: ally.summonerName }}"
            :class="[ally.summonerId === account.id ? 'font-bold text-blue-500' : 'text-teal-400']"
            class="relative ml-2"
          >{{ ally.summonerName }}</nuxt-link>
        </li>
      </ul>
      <ul class="w-1/2 text-right">
        <li
          v-for="(enemy, index) in enemyTeam"
          :key="enemy.summonerId"
          :class="index % 2 === 0 ? 'accent-enemy' : 'enemy'"
          class="flex items-center justify-end px-5 py-1 leading-loose text-overflow whitespace-nowrap"
        >
          <nuxt-link
            v-if="!enemy.bot"
            :to="{ name: 'summoner-region-name-mode', params: { region: $route.params.region, name: enemy.summonerName }}"
            class="relative text-red-300"
          >{{ enemy.summonerName }}</nuxt-link>
          <div
            :style="{backgroundImage: `url('https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${enemy.championId}.png')`}"
            class="w-6 h-6 ml-2 bg-center bg-cover rounded-full bg-white0"
          ></div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { liveGame } from '@/mixins/liveGame'

export default {
  mixins: [liveGame],
}
</script>
