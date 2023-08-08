<template>
  <div class="">
    <template v-if="$device.isDesktop">
      <div
        class="flex flex-col justify-end text-c-0"
      >
        <!-- Select Season -->
          <FilterSeason />
        
  
        <!-- <div class="flex justify-end mt-2 text-sm gap-2 text-white font-bold">
          <div class="px-2 py-2 leading-none" style="background-color: #E84057">저주</div>
          <div class="px-2 py-2 leading-none" style="background-color: #E84057">빡침</div>
          <div class="px-2 py-2 leading-none" style="background-color: #f17989">나쁨</div>
          <div class="px-2 py-2 leading-none" style="background-color: #f17989">억울</div>
          <div class="px-2 py-2 leading-none" style="background-color: #5383E8">보통</div>
          <div class="px-2 py-2 leading-none" style="background-color: #5383E8">좋음</div>
          <div class="px-2 py-2 leading-none" style="background-color: #2c7a7b">숟가락</div>
        </div> -->
        
        <div v-if="tier && scores && summonerScores !== null && $route.params.mode != 450" class="flex justify-between border border-gray-300 rounded-sm rounded-md gap-4 px-2 py-2 mt-2">
          
          <div class="relative flex flex-col items-start justify-center w-48 flex-1">
            <div class="relative w-full flex items-center justify-center py-1 bg-gray-200 rounded-md mb-2">
              <h2 class="mx-4 text-sm font-bold uppercase">
                최근 플레이 스타일
              </h2>
            </div>
            <div class="relative">
              <PolarAreaChart :chart-options="chartOptions" :chart-datas="chartDatas" css-classes="w-60 h-60 -mt-4" />
              <div class="absolute right-0 bottom-0 flex flex-col mr-1 mb-1 justify-center items-start">
                <div class="flex justify-center items-center">
                  <div class="w-4 h-4 rounded-full bg-gray-600"></div>
                  <div class="text-xxs ml-1 text-gray-600">티어 평균</div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex flex-col items-center justify-between pl-5 pr-1">
            <div class="relative w-full flex items-center justify-center py-1 bg-gray-200 rounded-md mb-2">
              <h2 class="mx-4 text-sm font-bold uppercase">
                최근 평가
              </h2>
            </div>


            <div
              :class="[colorInbun(summonerScores.total.inbun, 'text'), colorInbun(summonerScores.total.inbun, 'bg')]"
              class="relative flex flex-col items-center justify-center w-24 h-24 mt-2 rounded-md"
            >
              <div class="p-1 bg-white w-20 h-20 rounded-md">
                <div
                  class="flex flex-col justify-center items-center w-full h-full"
                >
                  <span class="font-gong text-3xl leading-none">{{ summonerScores.total.inbun }}</span>
                  <div class="font-gong text-base leading-none mt-1">인분</div>
                </div>
              </div>
            </div>

            <div
              :class="[colorInbun(summonerScores.teaam.score, 'text'), colorInbun(summonerScores.teaam.score, 'bg')]"
              class="relative flex flex-col items-center justify-center w-24 h-24 mt-2 rounded-md"
            >
              <div class="p-1 bg-white w-20 h-20 rounded-md">
                <div
                  class="flex flex-col justify-center items-center w-full h-full"
                >
                  <span class="font-gong text-3xl leading-none">{{ summonerScores.teaam.text }}</span>
                  <div class="font-gong text-base leading-none mt-1">팀운</div>
                </div>
              </div>
            </div>
          </div>
          

          <div v-if="mostChampion.length" class="flex flex-col items-center pl-5 pr-1">
            
            <div class="relative w-full flex items-center justify-center py-1 bg-gray-200 rounded-md mb-2">
              <h2 class="mx-4 text-sm font-bold uppercase">
                최근 챔피언
              </h2>
            </div>

            <ul class="text-left">
              <li
                v-for="(champion, index) in mostChampion"
                :key="index"
                :class="[{'': index % 2 === 0}]"
                class="relative flex items-center py-1 leading-tight"
              >
                <div class="flex items-center">
                  <div
                    class="w-10 h-10 bg-center bg-cover bg-teal-800 rounded-full flex-shrink-0"
                  >
                    <nuxt-img :src="`${champion.icon}`" format="webp" width="40" height="40" class="rounded-full" />
                  </div>
                  <div class="flex flex-col ml-2 text-xs font-bold truncate">
                    <div>{{ champion.name }}</div>
                    
                    <div
                      class="flex text-center"
                    >
                      <div class="text-xs">{{ champion.count }} 게임</div>
                      <div :class="classWin((champion.wins * 100 / champion.count), 'text')" class="text-xs ml-2">{{ champion.wins * 100 / champion.count | percent }}</div>
                      <div
                        class="text-center ml-2"
                        :class="classKda(champion.kda, 'text')"
                      >
                        <div
                          class="text-xs"
                        >{{ champion.kda|round(1) }} 평점</div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <div v-if="mostPosition.length" class="flex flex-col items-center pl-5">
            <div class="relative w-full flex items-center justify-center py-1 bg-gray-200 rounded-md mb-2">
              <h2 class="mx-4 text-sm font-bold uppercase">
                최근 포지션
              </h2>
            </div>
            <ul class="w-full text-sm text-c-0 text-left">
              <li
                v-for="(most, index) in mostPosition"
                :key="index"
                class="relative flex items-center py-1 leading-tight"
              >
                <div class="w-champion flex items-center">
                  <div
                    style="background-size: 100% 100%; background-repeat: no-repeat;"
                    class="w-10 h-10 bg-center bg-cover flex-shrink-0"
                  >
                    <nuxt-img :src="`https://zem.gg/img/roles/${most.role}.png`" format="webp" width="40" height="40" class="rounded-full" />
                  </div>
                  <div class="mx-1 truncate text-xs">
                    {{ most.role }}
                    <div class="flex">
                      <div class="">{{ most.count }} 게임</div>
                      <div class="ml-2">승률 {{ most.winRate|round(0) }}%</div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div v-else-if="$route.params.mode == '430' || $route.params.mode == '450'" class="text-sm px-4 py-2">
          <div class="py-4">칼바람, 일반은 지원하지 않습니다.</div>
          <div class="py-4 font-bold">ʢ´• ᴥ •`ʡ</div>
        </div>
        
        <div v-else class="text-sm px-4 py-2">
          <div class="py-4">소환사 기록이 충분하지 않습니다.</div>
          <div class="py-4 font-bold">ʢ´• ᴥ •`ʡ</div>
        </div>
      </div>
    </template>

    <template v-if="$device.isMobile">
      <div
        class="flex flex-col justify-end text-c-0 mt-2"
      >
        <!-- Select Season -->
          <FilterSeason />
        
  
        <!-- <div class="flex justify-end mt-2 text-sm gap-2 text-white font-bold">
          <div class="px-2 py-2 leading-none" style="background-color: #E84057">저주</div>
          <div class="px-2 py-2 leading-none" style="background-color: #E84057">빡침</div>
          <div class="px-2 py-2 leading-none" style="background-color: #f17989">나쁨</div>
          <div class="px-2 py-2 leading-none" style="background-color: #f17989">억울</div>
          <div class="px-2 py-2 leading-none" style="background-color: #5383E8">보통</div>
          <div class="px-2 py-2 leading-none" style="background-color: #5383E8">좋음</div>
          <div class="px-2 py-2 leading-none" style="background-color: #2c7a7b">숟가락</div>
        </div> -->
        
        <div v-if="tier && scores && summonerScores !== null && $route.params.mode != 450" class="flex flex-col justify-between border border-gray-300 rounded-sm rounded-md gap-4 px-2 py-2 mt-2">
          <div class="flex gap-2">
            <div class="relative flex flex-col items-start justify-center flex-1">
              <div class="relative w-full flex items-center justify-center py-1 bg-gray-200 rounded-md mb-2">
                <h2 class="mx-4 text-sm font-bold uppercase">
                  최근 플레이 스타일
                </h2>
              </div>
              <div class="relative">
                <PolarAreaChart :chart-options="chartOptions" :chart-datas="chartDatas" css-classes="w-60 h-60 -mt-4" />
                <div class="absolute right-0 bottom-0 flex flex-col mr-1 mb-1 justify-center items-start">
                  <div class="flex justify-center items-center">
                    <div class="w-4 h-4 rounded-full bg-gray-600"></div>
                    <div class="text-xxs ml-1 text-gray-600">티어 평균</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex flex-col items-center w-40">
              <div class="relative w-full flex items-center justify-center py-1 bg-gray-200 rounded-md mb-2">
                <h2 class="mx-4 text-sm font-bold uppercase">
                  최근 평가
                </h2>
              </div>
              <div
                :class="[colorInbun(summonerScores.total.inbun, 'text'), colorInbun(summonerScores.total.inbun, 'bg')]"
                class="relative flex flex-col items-center justify-center w-24 h-24 mt-2 rounded-md"
              >
                <div class="p-1 bg-white w-20 h-20 rounded-md">
                  <div
                    class="flex flex-col justify-center items-center w-full h-full"
                  >
                    <span class="font-gong text-3xl leading-none">{{ summonerScores.total.inbun }}</span>
                    <div class="font-gong text-base leading-none mt-1">인분</div>
                  </div>
                </div>
              </div>

              <div
                :class="[colorInbun(summonerScores.teaam.score, 'text'), colorInbun(summonerScores.teaam.score, 'bg')]"
                class="relative flex flex-col items-center justify-center w-24 h-24 mt-2 rounded-md"
              >
                <div class="p-1 bg-white w-20 h-20 rounded-md">
                  <div
                    class="flex flex-col justify-center items-center w-full h-full"
                  >
                    <span class="font-gong text-3xl leading-none">{{ summonerScores.teaam.text }}</span>
                    <div class="font-gong text-base leading-none mt-1">팀운</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-between gap-2">

              <div v-if="mostChampion.length" class="flex flex-col items-center flex-1">
    
                <div class="relative w-full flex items-center justify-center py-1 bg-gray-200 rounded-md mb-2">
                  <h2 class="mx-4 text-sm font-bold uppercase">
                    최근 챔피언
                  </h2>
                </div>

                <ul class="text-left">
                  <li
                    v-for="(champion, index) in mostChampion"
                    :key="index"
                    :class="[{'': index % 2 === 0}]"
                    class="relative flex items-center py-1 leading-tight"
                  >
                    <div class="flex items-center">
                      <div
                        class="w-10 h-10 bg-center bg-cover bg-teal-800 rounded-full flex-shrink-0"
                      >
                        <nuxt-img :src="`${champion.icon}`" format="webp" width="40" height="40" class="rounded-full" />
                      </div>
                      <div class="flex flex-col ml-2 text-xs font-bold truncate">
                        <div>{{ champion.name }}</div>
                        
                        <div
                          class="flex text-center"
                        >
                          <div class="text-xs">{{ champion.count }} 게임</div>
                          <div :class="classWin((champion.wins * 100 / champion.count), 'text')" class="text-xs ml-2">{{ champion.wins * 100 / champion.count | percent }}</div>
                          <div
                            class="text-center ml-2"
                            :class="classKda(champion.kda, 'text')"
                          >
                            <div
                              class="text-xs"
                            >{{ champion.kda|round(1) }} 평점</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>

              <div v-if="mostPosition.length" class="flex flex-col items-center w-40">
                <div class="relative w-full flex items-center justify-center py-1 bg-gray-200 rounded-md mb-2">
                  <h2 class="mx-4 text-sm font-bold uppercase">
                    최근 포지션
                  </h2>
                </div>
                <ul class="w-full text-sm text-c-0 text-left">
                  <li
                    v-for="(most, index) in mostPosition"
                    :key="index"
                    class="relative flex items-center py-1 leading-tight"
                  >
                    <div class="w-champion flex items-center">
                      <div
                        style="background-size: 100% 100%; background-repeat: no-repeat;"
                        class="w-10 h-10 bg-center bg-cover flex-shrink-0"
                      >
                        <nuxt-img :src="`https://zem.gg/img/roles/${most.role}.png`" format="webp" width="40" height="40" class="rounded-full" />
                      </div>
                      <div class="mx-1 truncate text-xs">
                        {{ most.role }}
                        <div class="flex">
                          <div class="">{{ most.count }} 게임</div>
                          <div class="ml-2">승률 {{ most.winRate|round(0) }}%</div>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
          </div>
        </div>

        <div v-else-if="$route.params.mode == '430' || $route.params.mode == '450'" class="text-sm px-4 py-2">
          <div class="py-4">칼바람, 일반은 지원하지 않습니다.</div>
          <div class="py-4 font-bold">ʢ´• ᴥ •`ʡ</div>
        </div>
        
        <div v-else class="text-sm px-4 py-2">
          <div class="py-4">소환사 기록이 충분하지 않습니다.</div>
          <div class="py-4 font-bold">ʢ´• ᴥ •`ʡ</div>
        </div>
      </div>
    </template>      
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Tooltip from '@/components/Common/Tooltip.vue'
import PolarAreaChart from '@/components/Charts/PolarArea.vue'
import FilterSeason from '@/components/Summoner/FilterSeason.vue'
import { gameModes } from '@/data/data.js'
import { getSummonerScore, getSummonerScoreTotal, getTeamScore, getColorTeamUn } from '@/helpers/summoner'

export default {
  components: {
    Tooltip,
    FilterSeason,
    PolarAreaChart
  },

  data: () => ({
    mostPosition: [],
    mostChampion: [],
    matchUn: '',
    summonerScores: null,
    currentDegree: {
      'kda': 0,
      'kills': 0,
      'assists': 0,
      'vision': 0,
      'total': 0
    },
    chartDatas: {
      labels: [
        '전투',
        '도움',
        '시야',
      ],
      datasets: [
        {
          backgroundColor: [],
          data: [50, 50, 50],
          fill: 1
        },
        {
          backgroundColor: '#4b556354',
          data: [50, 50, 50],
          fill: 1
        }
      ]
    },
    chartOptions: {
      scales: {
        r: {
          pointLabels: {
            display: true,
            centerPointLabels: true,
            font: {
              size: 14,
              weight: 'bold'
            }
          }
        }
      },
      plugins: {
          legend: {
              display: false
          },
          filler: {
            propagate: false
          },
          'samples-filler-analyser': {
            target: 'chart-analyser'
          }

      }
      ,animation: {
        animateRotate: true
        ,animateScale: true
      }
    },
  }),

  computed: {
    mostPlayedRole() {
      return Math.max(...this.stats.role.map(r => r.count), 0)
    },
    globalStatsKeys() {
      // eslint-disable-next-line no-unused-vars
      const { id, wins, losses, count, time, kp, ...rest } = this.stats.global
      return rest
    },
    ...mapState({
      account: state => state.summoner.basic.account,
      matches: state => state.summoner.overview.matches,
      tier: state => state.summoner.basic.ranked.soloQ.tier ? state.summoner.basic.ranked.soloQ.tier : state.summoner.basic.ranked.flex5v5.tier ? state.summoner.basic.ranked.flex5v5.tier : null,
      scores: state => state.summoner.basic.scores,
      stats: state => state.summoner.overview.stats
    }),
  },

  watch: {
    matches() {
      this.fetchData()
    },
  },
  
  created() {
    this.fetchData()
  },

  methods: {
    fetchData() {
      let sscore = {}
      sscore.kda = getSummonerScore(this.matches, this.scores, this.tier, 'kda')
      sscore.assists = getSummonerScore(this.matches, this.scores, this.tier, 'assists')
      sscore.kills = getSummonerScore(this.matches, this.scores, this.tier, 'kills')
      sscore.vision = getSummonerScore(this.matches, this.scores, this.tier, 'vision')
      
      if(sscore.kda == null || sscore.assists == null || sscore.kills == null || sscore.vision == null) {
        sscore = null

        this.$emit('setMetaStats', `소환사 분석 기록이 충분하지 않습니다.`)
      } else {
        sscore.total = getSummonerScoreTotal(sscore)
        sscore.teaam = getTeamScore(this.matches)
        
        if(sscore.teaam == null) {
          sscore = null

          this.$emit('setMetaStats', `소환사 분석 기록이 충분하지 않습니다.`)
        } else {
          
          this.$emit('setMetaStats', `소환사 인분: ${sscore.total.inbun}, 소환사 팀운: ${sscore.teaam.text}`)
          this.chartDatas.datasets[0]['data'] = [sscore.kills.percent, sscore.assists.percent, sscore.vision.percent]
          this.chartDatas['labels'] = ['전투' + this.scoreChart(sscore.kills.percent), '도움' + this.scoreChart(sscore.assists.percent), '시야' + this.scoreChart(sscore.vision.percent)]
          this.chartDatas.datasets[0]['backgroundColor'] = [this.colorChart(sscore.kills.percent), this.colorChart(sscore.assists.percent), this.colorChart(sscore.vision.percent)]
          
          
          this.mostPosition = this.getMostPosition()
          this.mostChampion = this.getMostChampion()
        }
      }

      
      this.summonerScores = sscore
    },

    colorInbun(score, type) {
      if (score < 1.0) {
        return type + '-red-600'
      }else if (score >= 1.0 && score < 2.5) {
        return type + '-blue-600'
      } else {
        return type + '-c-3'
      }
    },

    scoreChart(score) {
      if (score < 50) {
        return ' F'
      }else if (score >= 50 && score < 80) {
        return ' B'
      } else {
        return ' A'
      }
    },

    colorChart(score) {
      if (score < 50) {
        return '#dc2626d1'
      }else if (score >= 50 && score < 80) {
        return '#2563ebd1'
      } else {
        return '#4e41dbd1'
      }
    },

    colorTeamUn(score) {
      return getColorTeamUn(score)
    },
    

    classKda(kda, type) {
      if(kda < 1) {
        return type + '-red-600'
      } else if(kda >= 2 && kda < 3) {
        return type + '-blue-600'
      } else if(kda >= 3) {
        return type + '-purple-600'
      }
    },
    
    classWin(win, type) {
      if(win < 50) {
        return type + '-red-600'
      } else if(win >= 50 && win < 80) {
        return type + '-blue-600'
      } else if(win >= 80) {
        return type + '-purple-600'
      }
    },
    bestKda() {
      const bestChamp = this.mostPlayList.reduce((a, b) => {
        return a.kda > b.kda ? a : b
      })
      return bestChamp.kda
    },
    
    getMostPosition() {
      const newMatches = []

      this.matches.forEach((a) => {
        if(a.role === 'NONE' || a.result === 'Remake') return

        let n = []
        n.role = a.role
        n.kda = a.stats.kda
        n.win = (a.result === 'Win' ? 1 : 0)
        n.fail = (a.result === 'Fail' ? 1 : 0)
        
        newMatches.push(n)
      })
      
      const reduced = newMatches.reduce(function(m, d){
          if(!m[d.role]){
            m[d.role] = {...d, count: 1}
            return m
          }
          m[d.role].kda += d.kda
          m[d.role].win += d.win
          m[d.role].fail += d.fail

          m[d.role].count += 1
          
          return m
      },{})
      
      // Create new array from grouped data and compute the average
      let result = Object.keys(reduced).map(function(k){
          const item  = reduced[k]
          return {
              role: item.role,
              wins: item.win,
              fails: item.fail,
              kda: item.kda/item.count,
              winRate: item.win * 100 / item.count,
              count: item.count
          }
      }).sort(function(a, b) { // 내림차순
        return b['count'] - a['count']
      })

      return result.splice(0, 3)
    },
    getMostChampion() {
      const newMatches = []

      this.matches.forEach((a) => {
        if(a.role === 'NONE' || a.result === 'Remake') return

        let n = []
        n.championId = a.champion.id
        n.name = a.champion.name
        n.icon = a.champion.icon
        n.kda = a.stats.kda
        n.win = (a.result === 'Win' ? 1 : 0)
        n.fail = (a.result === 'Fail' ? 1 : 0)
        
        newMatches.push(n)
      })

      const reduced = newMatches.reduce(function(m, d){
          if(!m[d.championId]){
            m[d.championId] = {...d, count: 1}
            return m
          }
          m[d.championId].kda += d.kda
          m[d.championId].win += d.win
          m[d.championId].fail += d.fail
          m[d.championId].name = d.name
          m[d.championId].icon = d.icon

          m[d.championId].count += 1
          
          return m
      },{})
      
      const result = Object.keys(reduced).map(function(k){
          const item  = reduced[k]
          return {
              championId: item.championId,
              name: item.name,
              icon: item.icon,
              wins: item.win,
              fails: item.fail,
              kda: item.kda/item.count,
              winRate: item.win * 100 / item.count,
              count: item.count
          }
      }).sort(function(a, b) { // 내림차순
        return b['count'] - a['count']
      })

      return result.splice(0, 4)
    },

    calculateWinrate(wins, count) {
      const winrate = count !== 0 ? wins / count * 100 : 0
      const color = winrate >= 50 ? 'text-green-400' : 'text-red-400'
      return {
        winrate,
        color
      }
    },
    leagueStatsByType(typeName) {
      return this.stats.league
        .map(l => {
          return { ...l, ...gameModes[l.id] }
        })
        .filter(l => l.type === typeName)
    },
    roundedRoleLosses(win, count) {
      return win === count ? 'rounded-sm' : 'rounded-b-sm'
    },
    roundedRoleWins(win, count) {
      return win === count ? 'rounded-sm' : 'rounded-t-sm'
    },
    winLossColor(win, loss) {
      const colors = {
        win: 'text-teal-200',
        loss: 'text-teal-200'
      }
      win >= loss ? colors.win = 'text-green-400' : colors.loss = 'text-red-400'
      return colors
    }
  }
}
</script>
