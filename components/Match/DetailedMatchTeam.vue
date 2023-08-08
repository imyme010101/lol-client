<template>
  <div>
    <table
      v-if="$device.isDesktop"
      :class="[allyTeam ? 'text-blue-600' : 'text-red-600', { 'overflow-hidden': !allyTeam }]"
      class="w-full"
    >
      <thead class="leading-none">
        <tr
          class="relative font-semibold text-c-0"
        >
          <th class="py-5">
            <div 
              :class="allyTeam ? 'text-blue-600' : 'text-red-600'"
              class="flex gap-2"
            >
              <span
                class="pl-2"
              >{{ allyTeam ? "아군" : "적" }} 팀</span>
              <div
                class="flex pr-2"
              >
                <span
                  v-if="data.result === 'Win'"
                  class="ml-2px"
                >
                  승리
                </span>
                <span
                  v-else-if="data.result === 'Fail'"
                  class="ml-2px"
                >
                  패배
                </span>
              </div>
            </div>
          </th>
          <th class="px-2 py-5 text-sm">K</th>
          <th class="px-2 py-5 text-sm">D</th>
          <th class="px-2 py-5 text-sm">A</th>
          <th class="px-2 py-5 text-sm">
            CS
          </th>
          <th class="px-2 py-5 text-sm">
            딜량
          </th>
          <th class="px-2 py-5 text-sm">킬관여</th>
        </tr>
      </thead>
      <tbody
        class="leading-none"
      >
        <tr v-for="(player, index) in data.players" :key="player.name + index">
          <td class="py-2">
            <div class="flex justify-between px-1">
              <div class="flex">
                <div
                  :style="{ backgroundImage: `url('${player.champion.icon}')` }"
                  class="relative w-8 h-8 ml-2 bg-center bg-cover rounded-full bg-white0"
                >
                  <div
                    class="absolute bottom-0 flex items-center justify-center w-4 h-4 rounded-full level-position text-xxs bg-teal-800 text-teal-100"
                  >
                    <span>{{ player.level }}</span>
                  </div>
                </div>
                <div class="flex flex-col justify-around ml-1">
                  <Tooltip>
                    <template #trigger>
                      <div
                        :style="{
                          backgroundImage: `url(${
                            player.summonerSpell1 ? player.summonerSpell1.icon : null
                          })`,
                        }"
                        class="w-4 h-4 bg-center bg-cover rounded-md bg-white0"
                      ></div>
                    </template>
                    <template v-if="player.summonerSpell1" #default>
                      <div
                        class="flex max-w-sm p-2 text-xs text-left text-white select-none"
                      >
                        <div
                          :style="{
                            backgroundImage: `url('${player.summonerSpell1.icon}')`,
                          }"
                          class="flex-shrink-0 w-12 h-12 ml-1 bg-center bg-cover rounded-md bg-white0"
                        ></div>
                        <div class="ml-2 leading-tight">
                          <div class="text-base leading-none">
                            {{ player.summonerSpell1.name }}
                          </div>
                          <div class="mt-1 font-light text-teal-200">
                            {{ player.summonerSpell1.description }}
                          </div>
                        </div>
                      </div>
                    </template>
                  </Tooltip>
                  <Tooltip>
                    <template #trigger>
                      <div
                        :style="{
                          backgroundImage: `url(${
                            player.summonerSpell2 ? player.summonerSpell2.icon : null
                          })`,
                        }"
                        class="w-4 h-4 bg-center bg-cover rounded-md bg-white0"
                      ></div>
                    </template>
                    <template v-if="player.summonerSpell2" #default>
                      <div
                        class="flex max-w-sm p-2 text-xs text-left text-white select-none"
                      >
                        <div
                          :style="{
                            backgroundImage: `url('${player.summonerSpell2.icon}')`,
                          }"
                          class="flex-shrink-0 w-12 h-12 ml-1 bg-center bg-cover rounded-md bg-white0"
                        ></div>
                        <div class="ml-2 leading-tight">
                          <div class="text-base leading-none">
                            {{ player.summonerSpell2.name }}
                          </div>
                          <div class="mt-1 font-light text-teal-200">
                            {{ player.summonerSpell2.description }}
                          </div>
                        </div>
                      </div>
                    </template>
                  </Tooltip>
                </div>
                <div
                  class="flex flex-col justify-around ml-2px"
                >
                  <div
                    :style="[
                      player.primaryRune
                        ? {
                          background: `url(${player.primaryRune}) center/cover`,
                        }
                        : '',
                    ]"
                    class="w-4 h-4 rounded-md bg-white0"
                  ></div>
                  <div
                    :style="[
                      player.secondaryRune
                        ? {
                          background: `url(${player.secondaryRune}) center/cover`,
                        }
                        : '',
                    ]"
                    class="w-4 h-4 rounded-md bg-white0"
                  ></div>
                </div>
                <div
                  class="flex flex-col items-start justify-center ml-1 leading-none"
                >
                  <nuxt-link
                    v-if="player.summonerSpell1"
                    :to="{
                      name: 'summoner-region-name-mode',
                      params: { region: $route.params.region, name: player.name },
                    }"
                    :class="{
                      'font-bold text-c-1':
                        account.id === player.summonerId,
                    }"
                    class="overflow-hidden text-sm text-left whitespace-nowrap w-22 text-overflow"
                  >{{ player.name }}</nuxt-link>
                  <div
                    v-else
                    class="overflow-hidden text-sm text-left whitespace-nowrap w-22 text-overflow"
                  >
                    {{ player.name }}
                  </div>
                </div>
              </div>
              <div class="flex items-center">
                <div v-if="player.rank">
                  <div class="font-bold text-xxs">
                    {{ player.rank.shortName }}
                  </div>
                </div>
                <div v-else class="w-5 h-5">
                  <div class="-mt-1 text-2xl text-blue-300">-</div>
                </div>
                <MatchItems :items="player.items" />
              </div>
            </div>
          </td>
          <td class="relative">
            <div
              :style="fontColor(player, 'kills')"
              class="absolute inset-0 flex items-center justify-center p-2 text-xs font-bold"
            >
              {{ player.stats.kills }}
            </div>
          </td>
          <td class="relative">
            <div
              :style="fontColor(player, 'deaths')"
              class="absolute inset-0 flex items-center justify-center p-2 text-xs font-bold"
            >
              {{ player.stats.deaths }}
            </div>
          </td>
          <td class="relative">
            <div
              :style="fontColor(player, 'assists')"
              class="absolute inset-0 flex items-center justify-center p-2 text-xs font-bold"
            >
              {{ player.stats.assists }}
            </div>
          </td>
          <td class="relative">
            <div
              :style="fontColor(player, 'minions')"
              class="absolute inset-0 flex items-center justify-center p-2 text-xs font-bold"
            >
              {{ player['percentStats'].minions }}
            </div>
          </td>
          <td class="relative">
            <div
              :style="fontColor(player, 'dmgTaken')"
              class="absolute inset-0 flex items-center justify-center p-2 text-xs font-bold"
            >
              {{ player['stats'].dmgTaken | number }}
            </div>
          </td>
          <td class="relative">
            <div
              :style="fontColor(player, 'kp')"
              class="absolute inset-0 flex items-center justify-center p-2 text-xs font-bold"
            >
              {{ player.stats.kp }}
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <div
      v-if="$device.isMobile"
      :class="[allyTeam ? 'text-blue-600' : 'text-red-600', { 'overflow-hidden': !allyTeam }]"
      class="w-full flex flex-col"
    >
      <div class="py-1">
        <div 
          :class="allyTeam ? 'text-blue-600' : 'text-red-600'"
          class="flex gap-2"
        >
          <span
            class="pl-2"
          >{{ allyTeam ? "아군" : "적" }} 팀</span>
          <div
            class="flex pr-2"
          >
            <span
              v-if="data.result === 'Win'"
              class="ml-2px"
            >
              승리
            </span>
            <span
              v-else-if="data.result === 'Fail'"
              class="ml-2px"
            >
              패배
            </span>
          </div>
        </div>
      </div>

      <div
        class="flex justify-between px-1 my-1"
        v-for="(player, index) in data.players" :key="player.name + index"
      >
        <div class="w-20 flex">
          <div
            class="relative w-8 h-8 rounded-lg"
          >
            <nuxt-img :src="`${player.champion.icon}`" format="webp" width="80" height="80" class="w-8 h-8 rounded-lg" />
            <div
              class="absolute bottom-0 -mb-1 flex items-center justify-center w-4 h-4 rounded-full level-position text-xxs bg-c-3 text-white"
            >
              <span>{{ player.level }}</span>
            </div>
          </div>
          <div class="flex flex-col justify-around ml-1">
            <Tooltip>
              <template #trigger>
                <div
                  :style="{
                    backgroundImage: `url(${
                      player.summonerSpell1 ? player.summonerSpell1.icon : null
                    })`,
                  }"
                  class="w-4 h-4 bg-center bg-cover rounded-md bg-white0"
                ></div>
              </template>
              <template v-if="player.summonerSpell1" #default>
                <div
                  class="flex max-w-sm p-2 text-xs text-left text-white select-none"
                >
                  <div
                    :style="{
                      backgroundImage: `url('${player.summonerSpell1.icon}')`,
                    }"
                    class="flex-shrink-0 w-12 h-12 ml-1 bg-center bg-cover rounded-md bg-white0"
                  ></div>
                  <div class="ml-2 leading-tight">
                    <div class="text-base leading-none">
                      {{ player.summonerSpell1.name }}
                    </div>
                    <div class="mt-1 font-light text-teal-200">
                      {{ player.summonerSpell1.description }}
                    </div>
                  </div>
                </div>
              </template>
            </Tooltip>
            <Tooltip>
              <template #trigger>
                <div
                  :style="{
                    backgroundImage: `url(${
                      player.summonerSpell2 ? player.summonerSpell2.icon : null
                    })`,
                  }"
                  class="w-4 h-4 bg-center bg-cover rounded-md bg-white0"
                ></div>
              </template>
              <template v-if="player.summonerSpell2" #default>
                <div
                  class="flex max-w-sm p-2 text-xs text-left text-white select-none"
                >
                  <div
                    :style="{
                      backgroundImage: `url('${player.summonerSpell2.icon}')`,
                    }"
                    class="flex-shrink-0 w-12 h-12 ml-1 bg-center bg-cover rounded-md bg-white0"
                  ></div>
                  <div class="ml-2 leading-tight">
                    <div class="text-base leading-none">
                      {{ player.summonerSpell2.name }}
                    </div>
                    <div class="mt-1 font-light text-teal-200">
                      {{ player.summonerSpell2.description }}
                    </div>
                  </div>
                </div>
              </template>
            </Tooltip>
          </div>
          <div
            class="flex flex-col justify-around ml-2px"
          >
            <div
              :style="[
                player.primaryRune
                  ? {
                    background: `url(${player.primaryRune}) center/cover`,
                  }
                  : '',
              ]"
              class="w-4 h-4 rounded-md bg-white0"
            ></div>
            <div
              :style="[
                player.secondaryRune
                  ? {
                    background: `url(${player.secondaryRune}) center/cover`,
                  }
                  : '',
              ]"
              class="w-4 h-4 rounded-md bg-white0"
            ></div>
          </div>

        </div>
        
        <MatchItems :items="player.items" />
      </div>
    </div>
  </div>
</template>

<script>
import { colors } from '@/data/data.js'
import { mapActions, mapState } from 'vuex'
import DotsLoader from '@/components/Common/Loader.vue'
import Tooltip from '@/components/Common/Tooltip.vue'
import MatchItems from '@/components/Match/MatchItems.vue'

export default {
  components: {
    DotsLoader,
    Tooltip,
    MatchItems,
  },

  props: {
    allPlayers: {
      type: Array,
      required: true,
    },
    allyTeam: {
      type: Boolean,
      required: true,
    },
    data: {
      type: Object,
      required: true,
    },
    ranksLoaded: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    statsFormat() {
      return this.percentSettings ? 'percentStats' : 'stats'
    },
    ...mapState({
      account: (state) => state.summoner.basic.account,
      percentSettings: (state) => state.settings.percent,
    }),
  },

  methods: {
    fontColor(player, stats) {
      const value = parseFloat(player.stats[stats])
      const biggestValue = Math.max(
        ...this.allPlayers.map((p) => parseFloat(p.stats[stats])),
        0
      )
      const opacity = (value / biggestValue).toFixed(2)
      const biggestValueStyle = {}
      if (value === biggestValue && value !== 0) {
        biggestValueStyle.border = '2px solid'
        biggestValueStyle.borderColor = '#ff9628'
        biggestValueStyle.borderRadius = '0.375rem'
        biggestValueStyle.backgroundColor = '#fff'
      }

      return {
        color: `rgb(${colors[stats]})`,
        ...biggestValueStyle,
      }
    },
    selectRunes(player) {
      if (!player.perks) {
        return
      }

      this.displayOrHideRunes(player.perks)
    },
    ...mapActions('cdragon', ['displayOrHideRunes']),
  },
}
</script>

<style scoped>
.level-position {
  left: -5px;
}
</style>
