<template>
  <div key="records">
    <template v-if="!recordsLoaded || (recordsLoaded && records.assists)">
      <div class="relative w-full flex flex-col items-start justify-between px-4 py-4 bg-white border border-teal-600 rounded-sm shadow-sm text-teal-600">
        <div
          class="relative text-2xl"
        >소환사 챔피언 기록실</div>
        <div class="flex flex-col w-full">
          <template v-if="recordsLoaded">
            <RecordCard
              color="#63b3ed"
              text-color="text-teal-400"
              border-color="border-teal-400"
              :record="records.kda"
              title="KDA"
            />
            <RecordCard
              color="#68D391"
              text-color="text-green-500"
              border-color="border-green-500"
              :record="records.kills"
              title="최대 킬"
            />
            <RecordCard
              color="#9F7AEA"
              text-color="text-purple-500"
              border-color="border-purple-500"
              :record="records.assists"
              title="최대 어시스트"
            />
            <RecordCard
              color="#F56565"
              text-color="text-red-500"
              border-color="border-red-500"
              :record="records.deaths"
              title="최대 뎃"
            />
            <RecordCard
              color="#38b2ac"
              text-color="text-blue-500"
              border-color="border-teal-500"
              :record="records.damage_dealt_champions"
              title="최대 딜량"
            />
            <RecordCard
              color="#78716c"
              text-color="text-blue-500"
              border-color="border-teal-500"
              :record="records.kp"
              title="최대 킬관여"
            />
            <!-- <RecordCard
              color="#D69E2E"
              text-color="text-yellow-600"
              border-color="border-yellow-600"
              :record="records.gold"
              title="Gold earned"
            />
            <RecordCard
              color="#81E6D9"
              text-color="text-blue-300"
              border-color="border-teal-600"
              :record="records.minions"
              title="Minions killed"
            /> -->
          </template>
          <template v-else>
            <RecordLoader />
          </template>
        </div>
      </div>
    </template>
    <template v-if="recordsLoaded && !records.assists">
      <div class="flex flex-col items-center mt-4">
        <div>No records have been found.</div>
        <div>😕</div>
      </div>
    </template>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import RecordLoader from '@/components/Common/Loader.vue'
import RecordCard from '@/components/Summoner/Records/RecordCard.vue'

export default {
  components: {
    RecordLoader,
    RecordCard,
  },

  computed: {
    ...mapGetters('summoner', ['summonerFound']),
    ...mapState({
      account: state => state.summoner.basic.account,
      records: state => state.summoner.records.list,
      recordsLoaded: state => state.summoner.records.recordsLoaded,
    })
  },

  // watch: {
  //   recordsLoaded() {
  //     this.fetchData()
  //   },
  //   summonerFound() {
  //     this.fetchData()
  //   }
  // },

  // created() {
  //   this.fetchData()
  // },

  async asyncData({ store, params }) {
    if (store.state.summoner.basic.status !== 'found') {
      await store.dispatch('summoner/basicRequest', { summoner: params.name, region: params.region })
    }

    if (store.state.summoner.records.recordsLoaded == false) {
      await store.dispatch('summoner/recordsRequest')
    }
  },

  methods: {
    fetchData() {
      if (!this.recordsLoaded && this.summonerFound) {
        this.recordsRequest()
      }
    },
    ...mapActions('summoner', ['recordsRequest']),
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