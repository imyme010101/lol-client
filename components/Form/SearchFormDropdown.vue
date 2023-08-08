<template>
  <div
    :class="[{'mt-12': !homepage}, {'mt-12': homepage}]"
    class="absolute w-full"
  >
    <div class="bg-c-1 rounded-md shadow p-1">
      <div class="rounded-t-md bg-white">
        <div
          style="max-height: 300px;"
          class="px-3 pb-4 overflow-y-auto style-2"
        >
          <div>
            <div v-if="recentSearches.length" class="text-base text-c-0 font-bold pt-3 pb-2">최근 검색 소환사</div>
            <div v-else-if="favorites.length === 0" class="text-base text-c-0 font-bold pt-3 pb-2">주인장 소환사</div>
            <div
              ref="searches"
              @keydown.prevent.stop.enter="onOptionSelect()"
              @keydown.prevent.stop.space="onOptionSelect()"
              role="listbox"
              tabindex="-1"
              class="flex flex-wrap items-center text-xs leading-none focus:outline-none"
            >
              <template v-if="recentSearches.length">
                <SearchFormDropdownPlayer
                  v-for="(player, index) in recentSearchesSliced"
                  :key="player.name + player.region"
                  @close="close"
                  @mousemove.native="onHover(index + 1)"
                  :selected="index === selected - 1"
                  :player="player"
                  :favorites-list="false"
                />
              </template>
              <template v-else-if="favorites.length === 0">
                <SearchFormDropdownPlayer
                  @close="close"
                  @mousemove.native="onHover(1)"
                  :player="{name: 'fakeeeer', icon: 4874, region: 'kr'}"
                  :selected="selected === 1"
                  :favorites-list="false"
                />
              </template>
            </div>
          </div>
          <div v-if="favorites.length" :class="{'mt-4': recentSearches.length}">
            <div class="text-base text-c-0 font-bold pt-3 pb-2">즐겨찾는 소한사</div>
            <div
              ref="favorites"
              @keydown.prevent.stop.enter="onOptionSelect()"
              @keydown.prevent.stop.space="onOptionSelect()"
              role="listbox"
              tabindex="-1"
              class="flex flex-wrap items-center text-xs leading-none"
            >
              <SearchFormDropdownPlayer
                v-for="(player, index) in favorites"
                :key="player.name + player.region"
                @close="close"
                @mousemove.native="onHover(index + recentSearchesCount + 1)"
                :player="player"
                :selected="index === selected - 1 - recentSearchesCount"
                :favorites-list="true"
              />
            </div>
          </div>
        </div>
      </div>

      <div v-if="$device.isDesktop" class="px-4 py-4 bg-c-1">
        <div class="flex items-center justify-between select-none text-xxs">
          <div class="space-x-2">
            <span class="text-xs font-bold bg-c-2 rounded-md px-2 py-2">Enter</span>
            <span>소환사 선택</span>
          </div>
          <div class="space-x-2">
            <span class="text-xs font-bold bg-c-2 rounded-md px-2 py-2">&darr; &uarr;</span>
            <span>소환사 탑색</span>
          </div>
          <div class="space-x-2">
            <span class="text-xs font-bold bg-c-2 rounded-md px-2 py-2">Esc</span>
            <span>닫기</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import SearchFormDropdownPlayer from '@/components/Form/SearchFormDropdownPlayer.vue'

export default {
  components: {
    SearchFormDropdownPlayer,
  },

  props: {
    dropdown: {
      type: Boolean,
      default: false
    },
    homepage: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      bypassKeys: ['Esc', 'Escape', 'ArrowUp', 'ArrowDown', 'Enter', 'Space', '/'],
      favoritesCount: null,
      totalCount: null,
      recentSearchesCount: null,
      selected: null,
    }
  },

  computed: {
    allPlayers() {
      return [...this.recentSearchesSliced, ...this.favorites]
    },
    recentSearchesSliced() {
      return this.recentSearches.slice(0, 4)
    },
    ...mapState({
      selectedRegion: state => state.settings.region,
      favorites: state => state.settings.favorites,
      recentSearches: state => state.settings.recentSearches
    })
  },

  mounted() {
    window.addEventListener('mousedown', this.handleClick)
    window.addEventListener('keydown', this.handleKeyDown)

    // const input = document.querySelector('.summoner-input')
    // input.focus()
    this.recentSearchesCount = this.$refs.searches ? this.$refs.searches.children.length : 0
    this.favoritesCount = this.$refs.favorites ? this.$refs.favorites.children.length : 0
    this.totalCount = this.recentSearchesCount + this.favoritesCount

    if (this.totalCount > 0) {
      this.selected = 1
    }
  },

  beforeDestroy() {
    window.removeEventListener('mousedown', this.handleClick)
    window.removeEventListener('keydown', this.handleKeyDown)
  },

  methods: {
    close() {
      this.$emit('close')
      // Close region dropdown if open while closing global dropdown
      if (this.dropdown) {
        this.toggle()
      }
    },
    handleClick(e) {
      const bypassElements = document.querySelectorAll('.bypass-click')
      for (const element of bypassElements) {
        if (e.target === element || element.contains(e.target)) return
      }

      // Click outside to close region dropdown
      if (this.$refs['region-dropdown'] &&
        e.target !== this.$refs['region-dropdown'] &&
        !this.$refs['region-dropdown'].contains(e.target) && this.dropdown) {
        this.toggle()
      }

      e.preventDefault()
      this.$refs.searches.focus()
    },
    handleKeyDown(e) {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault()
        this.$refs.searches.focus()
        if (e.key === 'ArrowUp') {
          this.onArrowUp()
        } else {
          this.onArrowDown()
        }
      }

      if (this.bypassKeys.includes(e.key) ||
        (e.key === 'k' && (e.ctrlKey || e.metaKey))) {
        return
      }
      const input = document.querySelector('.summoner-input')
      input.focus()
    },
    onArrow() {
      const scrollIntoBlock = this.selected === 1 ? 'end' : (this.selected >= 7 ? 'start' : 'nearest')
      if (this.selected > this.recentSearchesCount) {
        this.$refs.favorites.children[this.selected - this.recentSearchesCount - 1].scrollIntoView({ block: scrollIntoBlock })
      } else {
        this.$refs.searches.children[this.selected - 1].scrollIntoView({ block: scrollIntoBlock })
      }
    },
    onArrowUp() {
      this.selected = this.selected - 1 < 1 ? this.totalCount : this.selected - 1
      this.onArrow()
    },
    onArrowDown() {
      this.selected = this.selected + 1 > this.totalCount ? 1 : this.selected + 1
      this.onArrow()
    },
    onHover(id) {
      this.selected = id

      if (this.$refs.searches && this.$refs.searches !== document.activeElement) {
        this.$refs.searches.focus()
        this.onArrow()
      }
    },
    onOptionSelect() {
      console.log('OPTION SELECT')
      if (this.selected === null) {
        return
      }
      const player = this.allPlayers[this.selected - 1]
      this.$router.push(`/summoner/${player.region}/${player.name}`).catch(() => { })
      this.close()
    },
    toggle() {
      this.$emit('toggle')
    },
  }
}
</script>

<style scoped>
.key {
  padding: 0.2rem 0.45rem;
  box-shadow: 0 2px 0 0 #3182ce, 0 5px 3px 0 rgba(0, 0, 0, 0.1),
    0 5px 2px 0 rgba(0, 0, 0, 0.06);
}
</style>
