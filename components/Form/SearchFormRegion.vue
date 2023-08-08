<template>
  <div class="w-full px-2 relative">
    <div
      @click="toggle"
      :class="[selectRegionClasses, {'text-c-1': !homepage}, {'text-c-2': homepage}]"
      class="flex items-center justify-center transition duration-150 ease-in-out border-2 border-transparent rounded cursor-pointer1 w-full"
    >
      <span class="font-bold uppercase select-none selected">{{ selectedRegion }}</span>
      <svg class="w-4 h-4">
        <use xlink:href="#caret-down" />
      </svg>
    </div>
    <transition name="scale-fade">
      <div
        v-show="dropdown"
        :class="[dropdownClasses]"
        class="absolute right-0 text-white shadow cursor-pointer mr-1"
      >
        <div
          v-for="(region, index) in regions"
          :key="region"
          @click="selectRegion(region)"
          :class="classRegions(index)"
          class="relative py-1 pl-5 pr-2 text-xs text-right select-none bg-c-1 hover:bg-c-2 hover:text-c-1"
        >
          <svg
            v-if="region.toLowerCase() === selectedRegion"
            class="absolute w-3 h-3 fill-current vertical-center dropIcon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path
              d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"
            />
          </svg>
          {{ region }}
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  props: {
    dropdown: {
      type: Boolean,
      default: false
    },
    homepage: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      regions: [
        'BR',
        'EUNE',
        'EUW',
        'JP',
        'KR',
        'LAN',
        'LAS',
        'NA',
        'OCE',
        'TR',
        'RU'
      ],
    }
  },

  computed: {
    dropdownClasses() {
      return {
        'dropDown rounded': !this.homepage,
        'dropDownXl rounded': this.homepage
      }
    },
    selectRegionClasses() {
      return {
        'text-base rounded-md': !this.homepage,
        'text-base rounded-md': this.homepage,
        'bg-c-1 text-c-2': this.dropdown && !this.homepage,
        'bg-c-1 text-c-2': this.dropdown && this.homepage,
      }
    },
    ...mapState({
      selectedRegion: state => state.settings.region
    }),
  },

  methods: {
    classRegions(index) {
      return {
        'rounded-t': index === 0,
        'rounded-b': index === this.regions.length - 1
      }
    },
    selectRegion(region) {
      this.toggle()
      this.updateSettings({ name: 'region', value: region.toLowerCase() })
    },
    toggle() {
      this.$emit('toggle')
    },
    ...mapActions('settings', ['updateSettings']),
  }
}
</script>

<style scoped>
.dropDown {
  top: 40px;
}

.dropDownXl {
  top: 58px;
  right: 50px;
}

.dropIcon {
  left: 4px;
}
</style>