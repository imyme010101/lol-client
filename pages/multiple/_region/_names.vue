<template>
  <div
    :class="{'page-wrapper mx-auto': $device.isDesktop}"
    class="relative z-10"
  >
    
    <div class="flex gap-2">
      <div class="w-5/12 flex flex-col flex border border-gray-300 rounded-sm rounded-md px-2 py-2 mt-2">
        <textarea
          rows="5" 
          placeholder="㉠㉡㉢㉣님이 로비에 참가하셨습니다.
  ㉠㉡㉢㉣님이 로비에 참가하셨습니다.
  ㉠㉡㉢㉣님이 로비에 참가하셨습니다.
  ㉠㉡㉢㉣님이 로비에 참가하셨습니다.
  ㉠㉡㉢㉣님이 로비에 참가하셨습니다."
          class="flex-1 p-2 rounded-md outline-none bg-white text-c0 dark:text-yellow-600 resize-none"
          v-model="multipleSummonerText"
        >

        </textarea>
        <button
          type="button"
          @click="submitForm"
          class="flex items-center justify-center w-full relative select-none w-full block px-4 py-2 mx-auto mt-4 font-semibold text-sm text-c-3 bg-white border border-gray-300 rounded-sm rounded-md"
        >
          완료
        </button>
      </div>

      <div class="w-7/12 flex flex-col flex border border-gray-300 rounded-sm rounded-md px-2 py-2 mt-2">
        <div
          v-if="multipleComplate === true"
          class="flex flex-col gap-1"
        >
          <span class="text-xl font-bold">소환사 멀티서치 결과 요약</span>
          <div class="flex flex-col text-sm mt-4">
            <span class="">- 캐리 후보: </span>
            <span>- 결과 URL: <router-link :to="{ name: 'multipleNames', params: { region: $route.params.region, names: summoners.multipleId }}">{{ baseUrl }}/multiple/kr/{{ summoners.multipleId }}</router-link></span>

          </div>
        </div>
        <div
          v-else
          class="h-full"
        >
          <div class="flex flex-col border border-gray-300 rounded-sm rounded-md px-2 py-2 bg-white h-full">
            <span class="text-xl font-bold">소환사 멀티서치 사용 설명서</span>
            <div class="flex flex-col text-sm mt-4">
              <span class="font-bold">ID 직접 입력도 가능합니다. (최대 5명)</span>
              <span class="text-xs">예)<br>㉠㉡㉢㉣, ㉠㉡㉢㉣, ㉠㉡㉢㉣, ㉠㉡㉢㉣, ㉠㉡㉢㉣</span>
              <span class="text-xs">예)<br>㉠㉡㉢㉣<br>㉠㉡㉢㉣<br>㉠㉡㉢㉣</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="multipleComplate === true" class="flex w-full mt-2">
      <MultipleSearch :accounts="summoners.accounts" :rankeds="summoners.rankeds" :summoner-scores="summonerScores" :chart-datas="chartDatas" />
    </div>
    <div v-else-if="multipleComplate === false && multipleLoading == true">
      <MultipleLoader />
    </div>
    <div v-else class="flex flex-col items-center justify-center border border-gray-300 rounded-sm rounded-md px-2 py-2 mt-2 mt-2">
      <div>
        롤 클라이언트 챔피언 픽 화면에서 채팅창의
      </div>
      <div class="py-4">
        <div class="text-c-3">“㉠㉡㉢㉣님이 로비에 참가하셨습니다.” 부분을 복사하여, 왼쪽 입력창에 붙여넣기 하세요.</div>
      </div>
      <div class="mt-4 text-2xl">– =͟͟͞͞ ( ꒪౪꒪)ฅ✧</div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import MultipleSearch from '@/components/Multiple/MultipleSearch.vue'
import MultipleLoader from '@/components/Common/Loader.vue'
import { getSummonerScore, getSummonerScoreTotal, getTeamScore, getCarryScore } from '@/helpers/summoner'
import { arrRankAsk } from '@/helpers/functions.js'
import { Buffer } from 'buffer'

export default {
  layout: (ctx) => ctx.$device.isDesktop ? 'home' : 'home.m',
  
  components: {
    MultipleSearch,
    MultipleLoader
  },

  data() {
    return {
      multipleSummonerText: '',
      multipleSummoner: [],
      summonerScores: [],
      chartDatas: [],
      multipleComplate: false
    }
  },

  computed: {
    baseUrl() {
      return process.env.SITE_URL;
    },
    ...mapState({
      summoners: state => state.multiple.summoners
    }),
    ...mapGetters('multiple', ['multipleFound', 'multipleNotFound', 'multipleLoading'])
  },
  
  watch: {
    $route(to, from) {
      if (from.params.region === to.params.region && from.params.names === to.params.names)
        return

      this.fetchData()
    }
  },
  
  created() {
    if (this.$route.params.region && this.$route.params.names)
      this.fetchData()
  },

  methods: {
    onCopy: function (e) {
      alert('You just copied the following text to the clipboard: ' + e.text)
    },
    onError: function (e) {
      alert('Failed to copy the text to the clipboard')
      console.log(e);
    },

    submitForm() {
      const summoners = (this.multipleSummonerText.replaceAll('님이 로비에 참가하셨습니다.', '').replaceAll('\n', ',').split(',')).slice(0, 5)
      const summonersString = summoners.join(',')
      
      this.$router.push(`/multiple/${this.$route.params.region}/${ Buffer.from(encodeURIComponent(summonersString)).toString('base64') }`)
    },

    async fetchData() {
      this.multipleComplate = false
        this.multipleSummonerText = !isNaN(this.$route.params.names) ? '' : decodeURIComponent(Buffer.from(this.$route.params.names, 'base64').toString())

        const summoners = !isNaN(this.$route.params.names) ? this.$route.params.names : this.multipleSummonerText.split(',')

        await this.multipleRequest({ summoners: summoners, region: this.$route.params.region })

        this.summoners.accounts.forEach((el, i) => {
          this.getChartDatas(i)
        })
      this.multipleComplate = true
    },

    getChartDatas(index) {
      const tier = this.summoners.rankeds[index]['soloQ']['tier'] != null ? this.summoners.rankeds[index]['soloQ']['tier'] : this.summoners.rankeds[index]['flex5v5']['tier'] != null ? this.summoners.rankeds[index]['flex5v5']['tier'] : null
      const scores = this.summoners.scores

      let tmp = {
        labels: [
          '전투',
          '도움',
          '시야'
        ],
        datasets: [
          {
            backgroundColor: [
              'rgba(255, 205, 86, 0.7)'
              ,'rgba(75, 192, 192, 0.7)'
              ,'rgba(54, 162, 235, 0.7)'
            ],
            data: [60, 70, 40]
          },
          {
            backgroundColor: [
              'rgba(255, 99, 132, 0.5)'
              ,'rgba(255, 99, 132, 0.5)'
              ,'rgba(255, 99, 132, 0.5)'
            ],
            data: [50, 50, 50]
          }
        ]
      }
      
      if(tier == null) {
        const datas = {
          kda: null,
          assists: null,
          kills: null,
          vision: null,
          total: null,
          team: null
        }
        this.summonerScores[index] = datas
        tmp['datasets'][0]['data'] = [0, 0, 0]
      } else {
        let datas = {
          kda: getSummonerScore(this.summoners.matchesDetailss[index], scores, tier, 'kda'),
          assists: getSummonerScore(this.summoners.matchesDetailss[index], scores, tier, 'assists'),
          kills: getSummonerScore(this.summoners.matchesDetailss[index], scores, tier, 'kills'),
          vision: getSummonerScore(this.summoners.matchesDetailss[index], scores, tier, 'vision'),
          team: getTeamScore(this.summoners.matchesDetailss[index])
        }
        datas['total'] = getSummonerScoreTotal(datas)
        datas['carry'] = getCarryScore(this.summoners.matchesDetailss[index])
        
        this.summonerScores[index] = datas
        tmp['datasets'][0]['data'] = [datas['kills']['percent'], datas['assists']['percent'], datas['vision']['percent']]
      }

      this.chartDatas[index] = tmp
    },
    ...mapActions('multiple', ['multipleRequest']),
  },
  
  metaInfo() {
    return {
      title: '멀티 서치',
    }
  }
}
</script>

<style scoped>
.line {
  background: rgba(178, 245, 234, 0.55);
}

.line::after {
  content: "";
  position: absolute;
  width: 4.5rem;
  height: 0.5rem;
  background: rgba(178, 245, 234, 0.55);
}

.line-top::after {
  transform-origin: bottom right;
  transform: rotate(90deg) translateX(100%);
}

.line-bottom::after {
  transform-origin: top left;
  transform: rotate(90deg) translateX(-100%);
  margin-left: 0.5rem;
}

.logo {
  padding: 32px 0 24px;
}
</style>