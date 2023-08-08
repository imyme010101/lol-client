<template>
<div class="w-full">
  <nuxt-link
    v-if="$device.isDesktop"
    @click.native="close"
    :to="{ name: 'summoner-region-name-mode', params: { region: player.region, name: player.name }}"
    :title="player.name"
    :class="selected ? 'bg-white border-c-1' : 'bg-c-2 border-gray-300'"
    class="flex items-center justify-between w-full px-4 py-3 mt-1 border-2 rounded-md shadow-md cursor-pointer select-none bypass-click"
    role="option"
  >
    <div class="flex items-center">
      <svg v-if="favoritesList" class="w-5 h-5 text-c-1">
        <use xlink:href="#star" />
      </svg>
      <svg v-else class="w-5 h-5">
        <use xlink:href="#time" />
      </svg>
      <div class="w-20">
        <div
          :class="selected ? 'bg-c-1 text-white' : 'bg-gray-300'"
          class="inline-flex px-2 py-1 ml-6 text-xs font-semibold uppercase rounded"
        >{{ player.region }}</div>
      </div>
      <div
        :style="{backgroundImage: `url('https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${player.icon}.jpg')`}"
        class="w-6 h-6 ml-2 bg-center bg-cover rounded-md"
      ></div>
      <div class="ml-2 text-base">{{ player.name }}</div>
    </div>
    <div class="flex items-center space-x-1">
      <button
        v-if="!favoritesList"
        @click.prevent="favoriteClick"
        class="flex items-center justify-center p-2 rounded-md hover:text-c-1 hover:bg-c-3"
      >
        <svg class="w-4 h-4">
          <use xlink:href="#star" />
        </svg>
      </button>
      <button
        @click.prevent="closeClick"
        class="p-2 rounded-full cursor-pointerhover:text-md hover:text-white hover:bg-c-3"
      >
        <svg class="w-4 h-4">
          <use xlink:href="#times" />
        </svg>
      </button>
    </div>
  </nuxt-link>

  <nuxt-link
    v-if="$device.isMobile"
    @click.native="close"
    :to="{ name: 'summoner-region-name-mode', params: { region: player.region, name: player.name }}"
    :title="player.name"
    :class="selected ? 'bg-white border-c-1' : 'bg-c-2 border-gray-300'"
    class="flex items-center justify-between w-full px-2 py-1 mt-1 border-2 rounded-md shadow-md cursor-pointer select-none bypass-click"
    role="option"
  >
    <div class="flex items-center">
      <div class="w-18 flex gap-2 items-center justify-center">
        <svg v-if="favoritesList" class="w-5 h-5 text-c-1">
          <use xlink:href="#star" />
        </svg>
        <svg v-else class="w-5 h-5">
          <use xlink:href="#time" />
        </svg>

        <div
          :class="selected ? 'bg-c-1 text-white' : 'bg-gray-300'"
          class="inline-flex px-2 py-1 text-xxs font-semibold uppercase rounded"
        >{{ player.region }}</div>
      </div>
      <div
        :style="{backgroundImage: `url('https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/${player.icon}.jpg')`}"
        class="w-6 h-6 ml-2 bg-center bg-cover rounded-md"
      ></div>
      <div class="ml-2 text-xs">{{ player.name }}</div>
    </div>
    <div class="flex items-center space-x-1">
      <button
        v-if="!favoritesList"
        @click.prevent="favoriteClick"
        class="flex items-center justify-center p-2 rounded-md hover:text-c-1 hover:bg-c-3"
      >
        <svg class="w-3 h-3">
          <use xlink:href="#star" />
        </svg>
      </button>
      <button
        @click.prevent="closeClick"
        class="p-2 ml-2 rounded-full cursor-pointerhover:text-md hover:text-white hover:bg-c-3"
      >
        <svg class="w-3 h-3">
          <use xlink:href="#times" />
        </svg>
      </button>
    </div>
  </nuxt-link>
</div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  props: {
    favoritesList: {
      type: Boolean,
      default: false,
    },
    player: {
      type: Object,
      required: true,
    },
    selected: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    closeClick() {
      if (this.favoritesList) {
        this.updateFavorite(this.player)
        return
      }
      this.removeRecentSearch(this.player)
    },
    favoriteClick() {
      this.updateFavorite(this.player)
    },
    ...mapActions('settings', ['removeRecentSearch', 'updateFavorite'])
  },
}
</script>