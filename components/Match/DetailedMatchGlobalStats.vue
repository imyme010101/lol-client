<template>
  <div :class="allyTeam ? 'text-left' : 'text-right'">
    <div v-if="team.bans">
      <Tooltip
        v-for="ban in team.bans"
        :key="'ban-' + ban.pickTurn"
        :class="{'ml-1': ban.pickTurn !== 6 && ban.pickTurn !== 1}"
        class="inline-block"
      >
        <template #trigger>
          <div
            :class="[allyTeam ? 'border-teal-600' : 'border-red-600']"
            class="relative border-2 rounded-full cursor-pointer"
          >
            <div
              :style="[ban.champion.id ? {backgroundImage: `url('${ban.champion.icon}')`} : '']"
              class="w-8 h-8 bg-center bg-cover rounded-full bg-teal-500 ban-champ"
            ></div>
          </div>
        </template>
        <template #default>
          <div class="px-2 text-xs leading-tight text-center text-white select-none">
            <div>{{ ban.champion.id ? ban.champion.name : '없음' }}</div>
          </div>
        </template>
      </Tooltip>
    </div>
    <div
      :class="allyTeam ? 'text-left' : 'text-right flex-row-reverse'"
      class="flex mt-2 leading-tight"
    >
      <div class="flex flex-col justify-end">
        <div class="text-sm font-medium"></div>
        <div class="flex text-xs text-teal-600">
          <div :class="allyTeam ? '' : 'mr-2'" class="w-16">
            <span :class="textColor">{{ team.towers }}</span> 타워
          </div>
          <div :class="allyTeam ? 'ml-2' : 'mr-2'" class="w-16">
            <span :class="textColor">{{ team.dragons }}</span> 드래곤
          </div>
          <div :class="allyTeam ? 'ml-2' : ''" class="w-16">
            <span :class="textColor">{{ team.barons }}</span> 바론
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Tooltip from '@/components/Common/Tooltip.vue'

export default {
  components: {
    Tooltip,
  },

  props: {
    team: {
      type: Object,
      required: true
    },
    allyTeam: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    textLightColor() {
      return this.allyTeam ? 'text-teal-100' : 'text-red-100'
    },
    textColor() {
      return this.allyTeam ? 'text-teal-600' : 'text-red-600'
    }
  }
}
</script>

<style scoped>
.ban-champ {
    -webkit-filter: grayscale(80%);
    filter: grayscale(80%);
}
</style>