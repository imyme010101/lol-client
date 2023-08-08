<template>
  <div
    class="relative w-full flex items-center justify-between px-4 py-2 bg-white border border-teal-600 rounded-sm shadow-sm text-teal-600 mt-4"
  >
    <div
      class="flex items-center font-medium leading-4 transition-colors duration-500 ease-in-out border border-transparent rounded-md"
    >
      <span :class="textColor" class="w-40 font-bold">{{ title }}</span>
      
      <div class="w-16">
        <img
          :src="`https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/${record.champion_id}.png`"
          :class="[{'opacity-0 scale-125': hover}, borderColor]"
          class="block w-full h-16 mx-auto transition duration-500 ease-in transform border-2 rounded-full"
          alt="Champion Played"
        />
      </div>

      <span :style="{textShadow: `-2px 1px 6px ${color}`}" class="ml-4 text-4xl">{{ record.champion.name }}</span>
    </div>

    <div class="flex text-4xl">
      <div :style="{textShadow: `-2px 1px 6px ${color}`}" class="w-40 text-right text-4xl">{{ record.amount }}</div>
    </div>
  </div>
</template>

<script>
import { gameModes } from '@/data/data.js'
import { timeDifference } from '@/helpers/functions.js'

export default {
  props: {
    borderColor: {
      type: String,
      required: true
    },
    color: {
      type: String,
      required: true
    },
    textColor: {
      type: String,
      required: true
    },
    record: {
      type: Object,
      required: true
    },
    title: {
      type: String,
      required: true
    },
  },

  data() {
    return {
      gradient: 'linear-gradient(180deg, rgba(42, 67, 101, 0.8) 0%, rgba(42, 67, 101, 0.95) 60%, rgba(42, 67, 101, 1) 100%)',
      gradientHover: 'linear-gradient(rgba(42, 67, 101, 0.1) 0%, rgba(42, 67, 101, 0.3) 60%, rgba(42, 67, 101, 0.5) 100%)',
      hover: false,
      gameModes,
    }
  },

  methods: {
    timeDifference
  }
}
</script>

<style scoped>
.record-card {
  max-width: 11rem;
}

.record-card:hover {
  filter: brightness(1.2);
}
</style>
