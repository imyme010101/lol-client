<template>
  <div class="w-full">
    <button
      @click="btnClicked"
      :disabled="loading"
      :class="[btnClass]"
      class="flex items-center justify-center w-full relative select-none"
      type="button"
    >
      <slot>Send</slot>
      <BounceLoader
        v-if="loading"
        class="text-teal-600 ml-2"
        :size="10"
      ></BounceLoader>
    </button>
  </div>
</template>

<script>
import BounceLoader from '@/components/Common/Loader.vue'

export default {
  components: {
    BounceLoader
  },

  props: {
    btnClass: {
      type: String,
      required: false,
      default: ''
    },
    loading: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  methods: {
    btnClicked() {
      this.$emit('clicked')
    }
  }
}
</script>