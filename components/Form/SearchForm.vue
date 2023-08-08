<template>
<div class="w-full flex items-center justify-center">
  <div
    v-if="open"
    @click="open = false"
    :style="{opacity: homepage ? 0 : 0.9}"
    class="fixed inset-0 z-20 bg-c-0"
  ></div>
  <form
    @submit.prevent="formSubmit"
    :class="[{'w-1/2 mx-auto bg-c-1': homepage}, {'w-7/12 bg-white': !homepage}, {'w-full': $device.isMobile}]"
    class="text-lg text-c-0 relative z-30 rounded"
  >
    <div
      class="flex justify-between"
    >

      <div class="w-16 flex items-center justify-center z-40">
        <SearchFormRegion
          @toggle="dropdown = !dropdown"
          :dropdown="dropdown"
          :homepage="homepage"
        />
      </div>
      
      <div class="flex flex-1">
        <input
          ref="input"
          v-model="summoner"
          @focus="open = true"
          :class="[{'placeholder-c-1 text-c-1': !homepage}, {'placeholder-c-2 text-c-2 bg-c-1': homepage}]"
          class="relative w-full py-2 font-bold outline-none rounded-sm summoner-input"
          spellcheck="false"
          type="text"
          placeholder="소환사명을 입력하세요."
        />     
      </div>

      <div class="w-12 flex items-center justify-center">
        <button
          ref="submit"
          :class="[{'text-c-1': !homepage}, {'text-c-2': homepage}]"
          type="submit"
        >
          <svg class="w-4 h-4">
            <use xlink:href="#search" />
          </svg>
        </button>
      </div>

      <transition name="scale-fade">
        <SearchFormDropdown
          v-if="open"
          v-model="summoner"
          @close="open = false"
          @toggle="dropdown = !dropdown"
          :dropdown="dropdown"
          :homepage="homepage"
        />
      </transition> 
    </div>
  </form>

</div>
</template>

<script>
import { mapState } from 'vuex'
import SearchFormDropdown from '@/components/Form/SearchFormDropdown.vue'
import SearchFormRegion from '@/components/Form/SearchFormRegion.vue'

export default {
  components: {
    SearchFormDropdown,
    SearchFormRegion
  },

  props: {
    homepage: {
      type: Boolean,
      default: false
    },
    isOpen: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      summoner: '',
      dropdown: false,
      open: this.isOpen
    }
  },

  computed: {
    ...mapState({
      selectedRegion: state => state.settings.region
    }),
  },

  watch: {
    open(newVal) {
      // Search Dropdown open
      if (newVal) {
        this.dropDownOpening()
      } else {
        this.dropDownClosing()
      }
    },
    $route(newRoute) {
      this.summoner = newRoute.params.name
      this.dropdown = false
      this.open = false
    }
  },

  created() {
    if (!this.summoner.length && !this.homepage) {
      this.summoner = this.$route.params.name
    }
    // 나중
    if(process.browser) {
      window.addEventListener('blur', this.windowBlur)
      window.addEventListener('keydown', this.handleEscape)
    }
  },

  beforeDestroy() {
    // 나중
    if(process.browser) {
      window.removeEventListener('blur', this.windowBlur)
      window.removeEventListener('keydown', this.handleEscape)
    }
    this.dropDownClosing()
  },

  methods: {
    dropDownClosing() {
    },
    dropDownOpening() {
    },
    formSubmit() {
      const search = this.summoner.replace('+', ' ').split(' ').join('')
      if (search.length) {
        this.$emit('formSubmit', search, this.selectedRegion)
      }
    },
    getScrollbarWidth() {
      const outer = document.createElement('div')
      outer.style.visibility = 'hidden'
      outer.style.overflow = 'scroll' // forcing scrollbar to appear
      outer.style.msOverflowStyle = 'scrollbar' // needed for WinJS apps
      document.body.appendChild(outer)

      const inner = document.createElement('div')
      outer.appendChild(inner)
      const scrollbarWidth = (outer.offsetWidth - inner.offsetWidth)

      outer.parentNode.removeChild(outer)

      return scrollbarWidth
    },
    handleEscape(e) {
      if (e.key === 'Esc' || e.key === 'Escape') {
        this.open = false
      } else if ((e.key === 'k' && (e.ctrlKey || e.metaKey)) || e.key === '/') {
        e.preventDefault()
        this.open = !this.open
      }
    },
    windowBlur() {
      this.open = false
    },
  }
}
</script>