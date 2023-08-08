<template>
  <div>
    <template v-if="$device.isDesktop">
      <div class="relative overflow-hidden h-screen">
        <nuxt />
      </div>
    </template>

    <template v-if="$device.isMobile">
      <nuxt />
    </template>
  </div>
</template>

<script>

export default {
  layout: (ctx) => ctx.$device.isDesktop ? 'multiple' : 'multiple.m',

  components: {
  },
  
  computed: {
    async asyncData({ store, params }) {
      await store.dispatch('cdragon/getRunes', {})
    }
  },

  methods: {
  }
}
</script>