<template>
  <div>
    <div v-if="champions.length" key="champions">
      <div class="flex items-center justify-end space-x-4">
        <FilterQueue @filter-queue="filterByQueue" :choices="queues" />
      </div>
      <ChampionsTable
        :champions="champions"
        :search="searchChampions"
        :only-most-played="onlyMostPlayed"
        class="mt-6"
      />
    </div>
    <div v-else>
      <ChampionsLoader />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import { gameModes } from '@/data/data.js'
import ChampionsTable from '@/components/Summoner/Champions/ChampionsTable.vue'
import FilterQueue from '@/components/Summoner/Champions/FilterQueue.vue'
import ChampionsLoader from '@/components/Common/Loader.vue'

export default {
  components: {
    ChampionsTable,
    FilterQueue,
    ChampionsLoader
  },

  data() {
    return {
      onlyMostPlayed: false,
      queue: null,
      searchChampions: ''
    }
  },

  computed: {
    queues() {
      // Only keep the gameModes the summoner has played
      const queues = Object.keys(gameModes)
        .filter(gameMode =>
          gameModes[gameMode].type !== 'Bot' &&
          this.gamemodes.includes(Number(gameMode))
        )
        .reduce((obj, key) => {
          return {
            ...obj,
            [key]: gameModes[key]
          }
        }, {})
      return { '0': { type: 'Normal', name: 'All queues' }, ...queues }
    },
    ...mapGetters('summoner', ['summonerFound']),
    ...mapState({
      account: state => state.summoner.basic.account,
      champions: state => state.summoner.champions.list,
      championsLoaded: state => state.summoner.champions.championsLoaded,
      gamemodes: state => state.summoner.basic.gamemodes
    })
  },

  watch: {
    summonerFound() {
      this.fetchData()
    }
  },

  // created() {
  //   this.fetchData()
  // },
  async asyncData({ store, params }) {
    if (store.state.summoner.basic.status !== 'found') {
      await store.dispatch('summoner/basicRequest', { summoner: params.name, region: params.region })
    }

    if (store.state.summoner.champions.championsLoaded == false) {
      await store.dispatch('summoner/championsRequest', null)
    }
  },
  
  methods: {
    fetch() {
      if (!this.championsLoaded && this.summonerFound) {
        this.championsRequest(this.queue)
      }
    },
    filterByQueue(queue) {
      queue = Number(queue)
      this.queue = queue === 0 ? null : queue
      this.championsRequest(this.queue)
    },
    updateSearch(search) {
      this.searchChampions = search
    },
    ...mapActions('summoner', ['championsRequest']),
  },

  head() {
    return {
      title: (this.$store.state.summoner.basic.status === 'found' ? `${this.account.name}` : `sss`) + ` - 소환사 챔피언 기록 | ${process.env['SITE_TITLE_FIX']}`,
      meta: [
        { hid: 'title', name: 'title', content: (this.$store.state.summoner.basic.status === 'found' ? `${this.account.name}` : ``) + ` - 소환사 챔피언 기록 | ${process.env.SITE_TITLE_FIX}` },
        { hid: 'og:title', name: 'og:title', content: (this.$store.state.summoner.basic.status === 'found' ? `${this.account.name}` : ``) + ` - 소환사 챔피언 기록 | ${process.env.SITE_TITLE_FIX}` },
        { hid: 'og:url', property: 'og:url', content: `https://zem.gg/summoner/${this.$route.params.region}/${this.$route.params.name}/records` },
      ],
      link: [
        { rel: 'canonical', href: `https://zem.gg/summoner/${this.$route.params.region}/${this.$route.params.name}/records` }
      ]
    }
  }
}
</script>
