<template>
  <div class="w-full">
    <template v-if="$device.isDesktop">
      <ul class="mt-2">
        <li      
          v-for="(match, index) in matches"
          :key="index"
          class="flex flex-col"
        >
          <div
            :class="[match.result, {'mt-4': index !== 0 }]"
            class="flex flex-col"
          >
            <div class="flex items-center justify-between text-c-0 match gap-4 items-stretch">
              <div
                :class="[match.result == 'Win' ? 'text-blue-600' : 'text-red-600']"
                class="flex flex-col justify-center items-start ml-2 w-24"
              >
                <div class="flex flex-col items-start">
                  <span
                    class="text-sm font-bold"
                  >{{ match.gamemode.name }}</span>
                  <span class="text-xxs mt-2 text-c-0">{{ match.date }}</span>
                </div>

                <div class="flex flex-col items-start text-xxs">
                  <span class="text-xxs text-c-0">{{ (match.time)|secToTime }}</span>
                </div>
              </div>

              <div class="flex flex-col justify-center gap-2">
                <div class="flex items-center gap-2 w-96">
                  <div class="flex flex-col">
                    <div
                      class="w-16 h-16 rounded-lg bg-c-0 flex justify-center items-center border-3 border-c-1"
                    >
                      <nuxt-img :src="`${match.champion.icon}`" format="webp" width="64" height="64" class="rounded-lg" />
                    </div>
                  </div>
                  <div class="flex gap-1">
                    <div class="flex flex-col gap-1">
                      <div
                        v-if="match.summonerSpell1"
                        class="w-7 h-7 rounded-lg bg-c-0 flex justify-center items-center"
                      >
                        <nuxt-img :src="`${match.summonerSpell1.icon}`" format="webp" width="20" height="20" class="rounded-lg" />
                      </div>
                      <div
                        v-else
                        class="w-7 h-7 rounded-lg bg-c-0 flex justify-center items-center"
                      ></div>
                      <div
                        v-if="match.summonerSpell2"
                        class="w-7 h-7 rounded-lg bg-c-0 flex justify-center items-center"
                      >
                        <nuxt-img :src="`${match.summonerSpell2.icon}`" format="webp" width="20" height="20" class="rounded-lg" />
                      </div>
                      <div
                        v-else
                        class="w-7 h-7 rounded-lg bg-c-0 flex justify-center items-center"
                      ></div>
                    </div>
                    <div class="flex flex-col gap-1">
                      <div
                        class="w-7 h-7 rounded-full flex justify-center items-center bg-c-0"
                      >
                        <nuxt-img :src="`${match.primaryRune}`" format="webp" width="28" height="28" class="rounded-full" />
                      </div>
                      <div
                        class="w-7 h-7 rounded-lg flex justify-center items-center"
                      >
                        <nuxt-img :src="`${match.secondaryRune}`" format="webp" width="28" height="28" class="w-full h-full rounded-full" />
                      </div>
                    </div>
                  </div>

                  <div class="flex flex-col flex-1 gap-2">
                    <div class="flex font-extrabold text-sm">
                      <div class="w-1/2">
                        <span class>{{ match.stats.kills }}</span>
                        <span class>/</span>
                        <span class>{{ match.stats.deaths }}</span>
                        <span class>/</span>
                        <span class>{{ match.stats.assists }}</span>
                      </div>
                      <div class=" w-1/2 font-extrabold text-sm">
                        <span class="ml-1">{{ match.stats.minions }} ({{ match.stats.gold|kilo }})</span>
                      </div>
                    </div>

                    <div
                      class="flex text-sm"
                    >
                      <div class="w-1/2">{{ match.stats.perfect ? '퍼팩트' : match.stats.kda }} 평점</div>
                      <div class="w-1/2">{{ match.stats.dmgChamp|kilo }}</div>
                    </div>
                  </div>
                </div>

                <div class="flex items-center gap-2">
                  <MatchItems :items="match.items" :one-row="true" />
              
                  <div class="flex justify-center items-center text-xxs gap-1 text-white font-bold">
                    
                    <div v-if="match.stats.mvp == true && match.result == 'Win'" class="bg-c-1 px-2 py-1 rounded-md">
                      MVP
                    </div>

                    <div v-else-if="match.stats.mvp == true && match.result == 'Fail'" class="bg-sky-600 px-2 py-1 rounded-md">
                      ACE
                    </div>
                    
                    <div v-if="match.stats.visionRank === 1 && match.stats.kpRank !== 10" class="bg-teal-600 px-2 py-1 rounded-md">
                      시야왕
                    </div>
                    <div v-else-if="match.stats.visionRank === 10 && match.stats.kpRank < 5" class="bg-purple-600 px-2 py-1 rounded-md">
                      리신왕
                    </div>

                    <div v-html="multiKill(match.stats)" class="font-bold"></div>
                  </div>
                </div>
              </div>

              <div class="flex items-center">
                <ul v-if="match.allyTeam.length > 1">
                  <li
                    v-for="(ally, ally_index) in match.allyTeam"
                    :key="'player-' + ally_index"
                    class="flex items-center leading-none text-c-0"
                  >
                    <nuxt-img :src="`${ally.champion.icon}`" format="webp" width="20" height="20" class="w-4 h-4" />
                    
                    <nuxt-link
                      v-if="ally.puuid !== '0' && account.puuid !== ally.puuid"
                      @click.native="$event.stopImmediatePropagation()"
                      :to="{ name: 'summoner-region-name-mode', params: { region: $route.params.region, name: ally.name.replace(' ', '') }}"
                      :class="isSummonerProfile(ally.puuid)"
                      class="w-28 overflow-hidden text-xs whitespace-nowrap text-overflow text-left ml-1"
                    >{{ ally.name }}</nuxt-link>
                    <div
                      v-else
                      :class="isSummonerProfile(ally.puuid)"
                      class="w-28 overflow-hidden text-xs text-c-1 whitespace-nowrap text-overflow text-left ml-1"
                    >{{ ally.name }}</div>


                    <div
                      v-if="(typeof match.enemyTeam[ally_index]) !== 'undefined'"
                      class="flex items-center leading-none my-1 ml-1"
                    >
                      <nuxt-img :src="`${match.enemyTeam[ally_index].champion.icon}`" format="webp" width="20" height="20" class="w-4 h-4" />
                    </div>
                    <div
                      v-if="(typeof match.enemyTeam[ally_index]) !== 'undefined'"
                      class="w-28 overflow-hidden text-xs text-left whitespace-nowrap text-overflow ml-1"
                    >
                      <nuxt-link
                        v-if="match.enemyTeam[ally_index].account_id !== '0'"
                        @click.native="$event.stopImmediatePropagation()"
                        :to="{ name: 'summoner-region-name-mode', params: { region: $route.params.region, name: match.enemyTeam[ally_index].name.replace(' ', '') }}"
                        class="w-28 overflow-hidden text-xs whitespace-nowrap text-overflow text-left ml-1"
                      >{{ match.enemyTeam[ally_index].name }}</nuxt-link>
                      <div
                        v-else
                        class="w-28 overflow-hidden text-xs whitespace-nowrap text-overflow text-left ml-1"
                      >{{ match.enemyTeam[ally_index].name }}</div>
                    </div>
                  </li>
                </ul>
              </div>

              <div class="flex w-8 flex-grow">
                <button
                    @click="toggleDetails(index)"
                    class="flex justify-center items-center w-full h-full"
                >
                  <svg
                    :class="[match.result == 'Win' ? 'text-blue-500' : 'text-red-500']"
                    class="w-4 h-4"
                  >
                    <use data-v-0a18d152="" xlink:href="#search"></use>
                  </svg>
                </button>
              </div>
            </div>
            <DetailedMatch :data="getMatchDetails(match.matchId) || {}" :details-open="showDetails" />
          </div>
        </li>
      </ul>
    </template>
    
    <template v-if="$device.isMobile">
      <ul class="w-full mt-2">
        <li      
          v-for="(match, index) in matches"
          :key="index"
          class="w-full"
        >
          <div
            :class="[match.result, {'mt-4': index !== 0 }]"
            class="flex flex-col items-center justify-between w-full text-c-0 match gap-4"
          >
            <div
              :class="[match.result == 'Win' ? 'text-blue-500' : 'text-red-500']"
              class="flex justify-between w-full text-xs py-1 px-2"
            >
              <div class="">
                <span
                  class="font-extrabold"
                >{{ match.gamemode.name }}</span>
                <span class="font-medium mt-2 text-c-0">{{ match.date }}</span>
                <span class="font-medium text-c-0">{{ (match.time)|secToTime }}</span>
              </div>
          
              <div class="flex justify-center items-center text-xxs gap-1 text-white font-bold">
                
                <div v-if="match.stats.mvp == true && match.result == 'Win'" class="bg-c-1 px-2 py-1 rounded-md">
                  MVP
                </div>

                <div v-else-if="match.stats.mvp == true && match.result == 'Fail'" class="bg-sky-600 px-2 py-1 rounded-md">
                  ACE
                </div>
                
                <div v-if="match.stats.visionRank === 1 && match.stats.kpRank !== 10" class="bg-teal-600 px-2 py-1 rounded-md">
                  시야왕
                </div>
                <div v-else-if="match.stats.visionRank === 10 && match.stats.kpRank < 5" class="bg-purple-600 px-2 py-1 rounded-md">
                  리신왕
                </div>
              </div>
              <div v-html="multiKill(match.stats)" class="font-bold"></div>
            </div>
            
            <div class="flex flex-col justify-start w-full gap-2 px-2 pb-1">
              <div class="flex items-center gap-2 w-full">
                <div class="flex flex-col">
                  <div
                    class="w-16 h-16 rounded-lg bg-c-0 flex justify-center items-center border-3 border-c-1"
                  >
                    <nuxt-img :src="`${match.champion.icon}`" format="webp" width="64" height="64" class="rounded-lg" />
                  </div>
                </div>
                <div class="flex gap-1">
                  <div class="flex flex-col gap-1">
                    <div
                      v-if="match.summonerSpell1"
                      class="w-7 h-7 rounded-lg bg-c-0 flex justify-center items-center"
                    >
                      <nuxt-img :src="`${match.summonerSpell1.icon}`" format="webp" width="20" height="20" class="rounded-lg" />
                    </div>
                    <div
                      v-else
                      class="w-7 h-7 rounded-lg bg-c-0 flex justify-center items-center"
                    ></div>
                    <div
                      v-if="match.summonerSpell2"
                      class="w-7 h-7 rounded-lg bg-c-0 flex justify-center items-center"
                    >
                      <nuxt-img :src="`${match.summonerSpell2.icon}`" format="webp" width="20" height="20" class="rounded-lg" />
                    </div>
                    <div
                      v-else
                      class="w-7 h-7 rounded-lg bg-c-0 flex justify-center items-center"
                    ></div>
                  </div>
                  <div class="flex flex-col gap-1">
                    <div
                      class="w-7 h-7 rounded-full flex justify-center items-center bg-c-0"
                    >
                      <nuxt-img :src="`${match.primaryRune}`" format="webp" width="28" height="28" class="rounded-full" />
                    </div>
                    <div
                      class="w-7 h-7 rounded-lg flex justify-center items-center"
                    >
                      <nuxt-img :src="`${match.secondaryRune}`" format="webp" width="28" height="28" class="w-full h-full rounded-full" />
                    </div>
                  </div>
                </div>

                <div class="flex flex-col flex-1 gap-2">
                  <div class="flex font-extrabold text-sm">
                    <div class="w-1/2">
                      <span class>{{ match.stats.kills }}</span>
                      <span class>/</span>
                      <span class>{{ match.stats.deaths }}</span>
                      <span class>/</span>
                      <span class>{{ match.stats.assists }}</span>
                    </div>
                    <div class=" w-1/2 font-extrabold text-sm">
                      <span class="ml-1">{{ match.stats.minions }} ({{ match.stats.gold|kilo }})</span>
                    </div>
                  </div>

                  <div
                    class="flex text-sm"
                    :class="classKda(match.stats.kda)"
                  >
                    <div class="w-1/2">{{ match.stats.perfect ? 'Perfect' : match.stats.kda }} KDA</div>
                    <div class="w-1/2">{{ match.stats.dmgChamp|kilo }}</div>
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <MatchItems :items="match.items" :one-row="true" />
                
                <div
                  :class="[match.result == 'Win' ? 'border-teal-500' : 'border-red-500']"
                  class="relative z-10 bg-teal-600 border w-8 h-8 cursor-pointer rounded-md"
                >
                  <button
                      @click="toggleDetails(index)"
                      :class="[match.result == 'Win' ? 'bg-blue-300' : 'bg-red-300']"
                      class="flex justify-center items-center w-full h-full rounded-md"
                  >
                    <svg
                      :class="[match.result == 'Win' ? 'text-blue-500' : 'text-red-500']"
                      class="w-4 h-4"
                    >
                      <use data-v-0a18d152="" xlink:href="#search"></use>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <DetailedMatch :data="getMatchDetails(match.matchId) || {}" :details-open="showDetails" />
        
        </li>
      </ul>
    </template>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import DetailedMatch from '@/components/Match/DetailedMatch.vue'
import MatchItems from '@/components/Match/MatchItems.vue'
import Ripple from '@/components/Common/Ripple.vue'

export default {
  components: {
    DetailedMatch,
    MatchItems,
    Ripple,
  },

  props: {
    matches: []
  },

  data() {
    return {
      showDetails: false,
    }
  },

  computed: {
    ...mapState({
      account: state => state.summoner.basic.account,
      roles: state => state.settings.roles
    }),
    ...mapGetters('detailedMatch', ['getMatchDetails']),
  },

  methods: {
    multiKill(stats) {
      let result = ''

      if(stats.doubleKills)
        result = "<div class=\"text-xxs bg-red-600 px-2 py-1 rounded-md text-white\">더블킬</div>"
      
      if(stats.tripleKills)
        result = "<div class=\"text-xxs bg-red-600 px-2 py-1 rounded-md text-white\">트리플킬</div>"

      if(stats.quadraKills)
        result = "<div class=\"text-xxs bg-red-600 px-2 py-1 rounded-md text-white\">쿼드라킬</div>"

      if(stats.pentaKills)
        result = "<div class=\"text-xxs bg-red-600 px-2 py-1 rounded-md text-white\">펜타킬</div>"

      return result
    },
    classKda(kda) {
      if(kda < 1) {
        return 'text-red-600'
      } else if(kda >= 2 && kda < 3) {
        return 'text-blue-600'
      } else if(kda >= 3) {
        return 'text-c-3'
      }
    },
    toggleDetails(index) {
      this.showDetails = !this.showDetails

      if (!this.getMatchDetails(this.matches[index].matchId)) {
        this.matchDetails(this.matches[index].matchId)
      }
    },
    isSummonerProfile(account_id) {
      return {
        'font-bold text-black': this.account.puuid === account_id
      }
    },
    ...mapActions('detailedMatch', ['matchDetails']),
  }
}
</script>

<style scoped>
.match {
  transition-duration: 0.3s;
  transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
}

.game-status {
  top: 50%;
  left: 6px;
  transform: translateY(-50%) rotate(-90deg);
}

.crop-champion {
  background-size: 74px;
  background-position: center;
}

.gold {
  color: #f3a05a;
}

.damage {
  color: #e25656;
}

.kp {
  color: #b78787;
}
</style>
