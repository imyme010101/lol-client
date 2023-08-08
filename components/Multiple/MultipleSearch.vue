<template>
  <div class="w-full flex gap-2">
    <div 
      v-for="(account, index) in accounts"
      :key="'summoner-' + index"
      :class="{'border-yellow-500': summonerScores[index].carryRank <= 2, 'border-teal-500': summonerScores[index].carryRank > 2}"
      class="w-1/5 flex flex-col border bg-white p-2"
    >
      <nuxt-link
        :to="{ name: 'summoner-region-name-mode', params: { region: $route.params.region, name: account.name }}"
        target= '_blank' 
        class="flex text-teal-100 cursor-pointer"
      >
        <span class="text-xl text-teal-600 font-extrabold leading-none">{{ account.name[0] }}</span>
        <span class="text-xl text-teal-600 font-extrabold leading-none">{{ account.name.substring(1) }}</span>
      </nuxt-link>
      <div class="flex items-center text-teal-600 gap-2 mt-2">
        <div class="text-sm">
          <span class="font-bold" style="color: rgb(140, 82, 58);">{{ rankeds[index]['soloQ']['fullRank'] }}</span>
        </div>
        <div v-if="rankeds[index]['flex5v5']" class="text-sm">
          <span class="font-bold" style="color: rgb(140, 82, 58);">{{ rankeds[index]['flex5v5']['fullRank'] }}</span>
        </div>
      </div>

      <div
        :class="{'border-yellow-500': summonerScores[index].carryRank <= 2, 'border-teal-500': summonerScores[index].carryRank > 2}"
        class="relative flex flex-col items-center justify-center w-full h-48 mt-2 flex-1 border-b"
      >
        <PolarAreaChart :chart-options="chartOptions" :chart-datas="chartDatas[index]" css-classes="w-48 h-48" />
        <div class="absolute right-0 bottom-0 flex mr-1 mb-2">
          <div class="w-4 h-4 rounded-full" style="background-color: rgba(255, 99, 132, 0.5)"></div>
          <div class="text-xxs ml-1 text-teal-700">티어 평균</div>
        </div>
      </div>

      <div class="relative flex flex-col items-center justify-center w-full h-48 flex-1">
        
        <div
          class="w-full flex justify-between py-2"
        >
          <div></div>
          <div
            v-if="summonerScores[index].carryRank <= 2"
            style="text-shadow: 2px 8px 6px rgba(0,0,0,0.2), 0px -5px 35px rgba(255,255,255,0.3);"
            class="text-sm font-bold text-yellow-500"
          >
            Carry {{ summonerScores[index].carryRank }}
          </div>
          <div
            v-else
            style="text-shadow: 2px 8px 6px rgba(0,0,0,0.2), 0px -5px 35px rgba(255,255,255,0.3);"
            class="text-sm font-bold text-blue-500"
          >
            Rank {{ summonerScores[index].carryRank }}
          </div>
          
        </div>
        
        <div
          class="relative flex items-center justify-center gap-2"
        >
          <div
            v-if="rankeds[index]['flex5v5']['tier'] != null || rankeds[index]['soloQ']['tier'] != null"
            :style="{backgroundColor: colorBorder(summonerScores[index]['total']['inbun']), color: colorBorder(summonerScores[index]['total']['inbun'])}"
            class="relative flex items-center justify-center w-20 h-20"
          >
            <div class="flex flex-col justify-center items-center p-1 bg-white w-16 h-16">
              <span class="font-black text-2xl leading-none">{{ summonerScores[index]['total']['inbun'] }}</span>
              <div class="font-black text-base leading-none mt-1">인분</div>
            </div>
          </div>
          
          <div
            v-else
            class="flex justify-center items-center w-20 h-20"
          >
            <div class="flex flex-col justify-center items-center p-1 bg-white w-16 h-16">
              <span class="font-black text-2xl leading-none">자료</span>
              <div class="font-black text-base leading-none mt-1">부족</div>
            </div>
          </div>
          
          <div
            v-if="rankeds[index]['flex5v5']['tier'] != null || rankeds[index]['soloQ']['tier'] != null"
            :style="{backgroundColor: colorTeamUn(summonerScores[index]['team']['score']), color: colorTeamUn(summonerScores[index]['team']['score'])}"
            class="relative flex items-center justify-center w-20 h-20"
          >
            <div
              class="flex flex-col justify-center items-center p-1 bg-white w-16 h-16"
            >
              <span class="font-black text-2xl leading-none">{{ summonerScores[index]['team']['text'] }}</span>
              <div class="font-black text-base leading-none mt-1">팀운</div>
            </div>
          </div>

          <div
            v-else
            class="flex justify-center items-center w-20 h-20"
          >
            <div class="flex flex-col justify-center items-center p-1 bg-white w-16 h-16">
              <span class="font-black text-2xl leading-none">자료</span>
              <div class="font-black text-base leading-none mt-1">부족</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PolarAreaChart from '@/components/Charts/PolarArea.vue'
import { getColorTeamUn } from '@/helpers/summoner'

export default {
  components: {
    PolarAreaChart
  },

  props : {
    accounts: [],
    rankeds: [],
    summonerScores: [],
    chartDatas: []
  },

  data() {
    return {
      chartOptions: {
        scales: {
          r: {
            pointLabels: {
              display: true,
              centerPointLabels: true,
              font: {
                size: 12,
                weight: 'bold'
              }
            }
          }
        },
        plugins: {
            legend: {
                display: false
            }
        }
        ,animation: {
          animateRotate: true
          ,animateScale: true
        }
      }
    }
  },

  computed: {
  },

  created() {
  },

  methods: {
    colorBorder(score) {
      if (score < 1.0) {
        return '#E84057'
      }else if (score >= 1.0 && score < 2.5) {
        return '#5383E8'
      } else {
        return '#2c7a7b'
      }
    },
    
    colorTeamUn(score) {
      return getColorTeamUn(score)
    },
  },
}
</script>