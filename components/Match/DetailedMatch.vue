<template>
  <div>
    <template v-if="$device.isDesktop">
      <transition name="slide">
        <div v-if="data.status === 'loaded' && detailsOpen">
          <DetailedMatchTeam
            :data="allyTeam"
            :all-players="[...allyTeam.players, ...enemyTeam.players]"
            :ally-team="true"
            :ranks-loaded="data.ranksLoaded"
          />

          <div class="flex items-center justify-between px-3 py-2">
            <DetailedMatchGlobalStats :team="allyTeam" :ally-team="true" />
            <div class="w-full text-blue-100 text-xxs">
              <div class="relative w-full text-xxs h-4">
                <div class="absolute flex justify-between h-full inset-0 mx-auto" style="width: 98%;">
                  <div>{{ allyTeam.teamStats.kills }}</div>
                  <div>Total Kill</div>
                  <div>{{ enemyTeam.teamStats.kills }}</div>
                </div>
                <div class="absolute flex bg-blue-400 w-full h-full inset-0">
                  <div class="h-full bg-blue-600" :style="{ width: `${this.$options.filters.percentage(allyTeam.teamStats.kills, allyTeam.teamStats.kills + enemyTeam.teamStats.kills)}%` }"></div>
                  <div class="h-full bg-red-600" :style="{ width: `${this.$options.filters.percentage(enemyTeam.teamStats.kills, allyTeam.teamStats.kills + enemyTeam.teamStats.kills)}%` }"></div>
                </div>
              </div>

              <div class="relative w-full text-xxs h-4 mt-2">
                <div class="absolute flex justify-between h-full inset-0 mx-auto" style="width: 98%;">
                  <div>{{ allyTeam.teamStats.gold | number }}</div>
                  <div>Total Gold</div>
                  <div>{{ enemyTeam.teamStats.gold | number }}</div>
                </div>
                <div class="absolute flex bg-blue-400 w-full h-full inset-0">
                  <div class="h-full bg-blue-600" :style="{ width: `${this.$options.filters.percentage(allyTeam.teamStats.gold, allyTeam.teamStats.gold + enemyTeam.teamStats.gold)}%` }"></div>
                  <div class="h-full bg-red-600" :style="{ width: `${this.$options.filters.percentage(enemyTeam.teamStats.gold, allyTeam.teamStats.gold + enemyTeam.teamStats.gold)}%` }"></div>
                </div>
              </div>
            </div>

            <DetailedMatchGlobalStats :team="enemyTeam" :ally-team="false" />
          </div>

          <DetailedMatchTeam
            :data="enemyTeam"
            :all-players="[...allyTeam.players, ...enemyTeam.players]"
            :ally-team="false"
            :ranks-loaded="data.ranksLoaded"
          />
        </div>
        <div v-else-if="data.status === 'loading' && detailsOpen">
          <div class="py-5 bg-white">
            <DetaileLoader />
          </div>
        </div>
      </transition>
    </template>

    <template v-if="$device.isMobile">
      <transition name="slide">
        <div v-if="data.status === 'loaded' && detailsOpen">
          <DetailedMatchTeam
            :data="allyTeam"
            :all-players="[...allyTeam.players, ...enemyTeam.players]"
            :ally-team="true"
            :ranks-loaded="data.ranksLoaded"
          />

          <div class="flex items-center justify-between px-3 py-2">
            <DetailedMatchGlobalStats :team="allyTeam" :ally-team="true" />
            <div class="w-full text-teal-100 text-xxs">
              <div class="relative w-full text-xxs h-4">
                <div class="absolute flex justify-between h-full inset-0 mx-auto" style="width: 98%;">
                  <div>{{ allyTeam.teamStats.kills }}</div>
                  <div>Total Kill</div>
                  <div>{{ enemyTeam.teamStats.kills }}</div>
                </div>
                <div class="absolute flex bg-teal-400 w-full h-full inset-0">
                  <div class="h-full bg-teal-600" :style="{ width: `${this.$options.filters.percentage(allyTeam.teamStats.kills, allyTeam.teamStats.kills + enemyTeam.teamStats.kills)}%` }"></div>
                  <div class="h-full bg-red-600" :style="{ width: `${this.$options.filters.percentage(enemyTeam.teamStats.kills, allyTeam.teamStats.kills + enemyTeam.teamStats.kills)}%` }"></div>
                </div>
              </div>

              <div class="relative w-full text-xxs h-4 mt-2">
                <div class="absolute flex justify-between h-full inset-0 mx-auto" style="width: 98%;">
                  <div>{{ allyTeam.teamStats.gold | number }}</div>
                  <div>Total Gold</div>
                  <div>{{ enemyTeam.teamStats.gold | number }}</div>
                </div>
                <div class="absolute flex bg-teal-400 w-full h-full inset-0">
                  <div class="h-full bg-teal-600" :style="{ width: `${this.$options.filters.percentage(allyTeam.teamStats.gold, allyTeam.teamStats.gold + enemyTeam.teamStats.gold)}%` }"></div>
                  <div class="h-full bg-red-600" :style="{ width: `${this.$options.filters.percentage(enemyTeam.teamStats.gold, allyTeam.teamStats.gold + enemyTeam.teamStats.gold)}%` }"></div>
                </div>
              </div>
            </div>

            <DetailedMatchGlobalStats :team="enemyTeam" :ally-team="false" />
          </div>

          <DetailedMatchTeam
            :data="enemyTeam"
            :all-players="[...allyTeam.players, ...enemyTeam.players]"
            :ally-team="false"
            :ranks-loaded="data.ranksLoaded"
          />
        </div>
        <div v-else-if="data.status === 'loading' && detailsOpen">
          <div class="py-5 bg-white">
            <DetaileLoader />
          </div>
        </div>
      </transition>
    </template>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import DetailedMatchGlobalStats from '@/components/Match/DetailedMatchGlobalStats.vue'
import DetailedMatchTeam from '@/components/Match/DetailedMatchTeam.vue'
import SwitchToggle from '@/components/Form/SwitchToggle.vue'
import DetaileLoader from '@/components/Common/Loader.vue'

export default {
  components: {
    DetailedMatchGlobalStats,
    DetailedMatchTeam,
    SwitchToggle,
    DetaileLoader
  },
  props: {
    data: {
      type: Object,
      required: true
    },
    detailsOpen: {
      type: Boolean,
      required: true
    }
  },

  computed: {
    allyTeam() {
      return this.data.blueTeam.players.some(p => p.summonerId === this.account.id) ? this.data.blueTeam : this.data.redTeam
    },
    enemyTeam() {
      return this.data.blueTeam.players.some(p => p.summonerId === this.account.id) ? this.data.redTeam : this.data.blueTeam
    },
    ...mapState({
      account: state => state.summoner.basic.account,
      percentSettings: state => state.settings.percent
    }),
  },

  data() {
    return {
      
    }
  },

  methods: {
    ...mapActions('settings', ['updatePercent']),
  }
}
</script>

<style scoped>
.slide-enter-active {
  transition-duration: 0.3s;
  transition-timing-function: ease-in;
}

.slide-leave-active {
  transition-duration: 0.3s;
  transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
}

.slide-enter-to,
.slide-leave {
  max-height: 737px;
  overflow: hidden;
}

.slide-enter,
.slide-leave-to {
  overflow: hidden;
  max-height: 0;
}
</style>
