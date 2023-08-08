<template>
  <div class="relative inline-block leading-none text-sm text-teal-600 border border-teal-400 py-2">
    <select
      v-model="queue"
      @change="filterQueue"
      class="block w-full px-6 pr-8 bg-transparent rounded-md appearance-none cursor-pointer focus:outline-none"
      style="width: 144px;"
    >
      <option v-for="(key) in Object.keys(choices)" :key="key" :value="key">{{ choices[key].name }}</option>
    </select>
    <div
      class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none"
    >
      <svg class="w-5 h-5">
        <use xlink:href="#chevron-down" />
      </svg>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: {
    choices: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      queue: ''
    }
  },

  created() {
    // Show all queues when loading the page
    this.queue = 0
  },

  destroyed() {
    // Reload all champions stats for next user visit of the champions tab
    if (this.queue !== 0)
      this.championsNotLoaded()
  },

  methods: {
    filterQueue() {
      this.$emit('filter-queue', this.queue)
    },
    ...mapActions('summoner', ['championsNotLoaded']),
  }
}
</script>
