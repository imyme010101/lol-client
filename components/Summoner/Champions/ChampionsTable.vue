<template>
  <table class="w-full leading-none text-center bg-white border border-teal-400 rounded-sm shadow-sm">
    <thead>
      <tr class="text-sm select-none text-blue-500 bg-blue-300">
        <th
          @click="sortBy('index')"
          :class="sortedClasses('index')"
          class="relative px-2 py-4 font-normal cursor-pointer"
        >rank</th>
        <th
          v-for="(heading, index) in headings"
          :key="`champHeading-${index}`"
          @click="sortBy(heading.props)"
          v-html="heading.name"
          :class="[
            {
              'w-name': heading.name === 'Name',
              'w-kda': heading.name === 'KDA'
            }, 
            sortedClasses(heading.props)
          ]"
          class="relative px-2 py-4 font-normal cursor-pointer"
        ></th>
      </tr>
    </thead>
    <tbody v-if="champions.length">
      <tr
        v-for="(champion, index) in championsToDisplay"
        :key="champion._id"
        :class="{'rounded-b-lg': index === championsToDisplay.length - 1}"
        class="text-blue-500 font-bold"
      >
        <td
          :class="{'rounded-bl-lg': index === championsToDisplay.length - 1}"
          class="px-2 py-3 text-sm"
        >{{ champion.index + 1 }}</td>
        <td class="px-2 py-3 text-xs w-40">
          <div class="flex items-center">
            <div
              :style="{backgroundImage: `url('${champion.champion.icon}')`}"
              class="flex-shrink-0 w-6 h-6 bg-center bg-cover rounded-full bg-white0"
            ></div>
            <div class="ml-2">{{ champion.champion.name }}</div>
          </div>
        </td>
        <td
          :style="bgColor(champion, 'winrate')"
          class="px-2 py-3 text-sm"
        >{{ champion.winrate|percent }}</td>
        <td
          :style="bgColor(champion, 'playrate')"
          class="px-2 py-3 text-sm"
        >{{ champion.playrate|percent }}</td>
        <td
          :style="bgColor(champion, 'wins')"
          class="px-2 py-3 text-sm"
        >{{ champion.wins }}</td>
        <td
          :style="bgColor(champion, 'count')"
          class="px-2 py-3 text-sm"
        >{{ champion.count }}</td>
        <td :style="bgColor(champion, 'kda')" class="px-2 py-3 text-sm">
          <div>{{ champion.kda|round }}</div>
          <div class="mt-1 whitespace-nowrap text-xxs">
            {{ champion.kills/champion.count|round(1) }}
            /
            {{ champion.deaths/champion.count|round(1) }}
            /
            {{ champion.assists/champion.count|round(1) }}
          </div>
        </td>
        <td
          :style="bgColor(champion, 'kp')"
          class="px-2 py-3 text-sm"
        >{{ champion.kp|percent }}</td>
        <td
          :class="{'rounded-br-lg': index === championsToDisplay.length - 1}"
          class="px-2 py-3 text-xs"
        >{{ champion.lastPlayed }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { colors } from '@/data/data.js'
import { timeDifference } from '@/helpers/functions.js'

export default {
  props: {
    champions: {
      type: Array,
      required: true
    },
    onlyMostPlayed: {
      type: Boolean,
      default: false
    },
    search: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      headings: [
        {
          name: '챔피언',
          props: 'champion.name'
        },
        {
          name: '승률',
          props: 'winrate'
        },
        {
          name: '사용률',
          props: 'playrate'
        },
        {
          name: '승리',
          props: 'wins'
        },
        {
          name: '플레이 횟수',
          props: 'count'
        },
        {
          name: 'KDA',
          props: 'kda'
        },
        {
          name: 'KP',
          props: 'kp'
        },
        {
          name: '최근 게임',
          props: 'date'
        }
      ],
      championsFull: [],
      sortProps: 'index',
      order: -1
    }
  },

  computed: {
    championsToDisplay() {
      return this.championsFull.filter(c => {
        const playedEnough = this.onlyMostPlayed ? c.playrate >= 1 : true
        const searched = c.champion.name.toLowerCase().includes(this.search.toLowerCase())
        return playedEnough && searched
      })
    },
    totalGames() {
      return this.champions.reduce((agg, champ) => agg + champ.count, 0)
    }
  },

  watch: {
    champions() {
      this.updateChampionsList()
    },
    championsToDisplay() {
      this.reApplySorts()
    }
  },

  created() {
    this.updateChampionsList()
  },

  methods: {
    bgColor(champion, stats) {
      // const biggestValue = Math.max(
      //   ...this.championsToDisplay
      //     .filter(c => c[stats] !== Infinity)
      //     .map(c => parseFloat(c[stats]))
      //   , 0)
      // Take the second biggest Value if it's an Infinity KDA
      // const value = champion[stats] === Infinity ? biggestValue : parseFloat(champion[stats])
      // const opacity = (value / biggestValue).toFixed(2)

      return {
        color: `rgb(${colors[stats]})`
      }
    },
    sortBy(props) {
      // Change order of the sort
      if (props === this.sortProps) {
        this.order *= -1
      } else {
        this.order = -1
      }

      this.championsToDisplay.sort((a, b) => {
        const aProp = props.split('.').reduce((p, c) => p && p[c], a)
        const bProp = props.split('.').reduce((p, c) => p && p[c], b)
        let order = typeof aProp === 'string' ? aProp.localeCompare(bProp) : aProp - bProp

        if (this.order == -1)
            order *= -1

        // Revert order for rank and champion name
        if (props === 'index' || props === 'champion.name') {
          order *= -1
        }

        // Second sort by champion name
        return order || a.champion.name.localeCompare(b.champion.name)
      })
      this.sortProps = props
    },
    reApplySorts() {
      this.order *= -1
      this.sortBy(this.sortProps)
    },
    sortedClasses(props) {
      return {
        'sorted': this.sortProps === props,
        'sorted-asc': this.sortProps === props && this.order === 1,
        'sorted-desc': this.sortProps === props && this.order === -1,
      }
    },
    updateChampionsList() {
      this.championsFull = this.champions.map((champ, index) => {
        let kda = champ.kills === 0 && champ.assists === 0 && champ.deaths === 0 ? 0 : (champ.kills + champ.assists) / champ.deaths
        return {
          ...champ,
          winrate: champ.wins * 100 / champ.count,
          playrate: champ.count * 100 / this.totalGames,
          kda,
          index,
          lastPlayed: timeDifference(champ.date),
          show: true
        }
      })
    }
  }

}
</script>

<style scoped>
.heading {
  box-shadow: none;
}

.sorted::after {
  content: "";
  position: absolute;
  top: -15px;
  left: 0;
  height: 15px;
  width: 100%;
  border: 1px solid #a8a29e;
  border-bottom: 0;
  background-color: #d6d3d1;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 16px 16px;
  border-radius: 0.125rem 0.125rem 0 0;
}

.sorted-asc::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 512'%3E%3Cpath fill='black' d='M288.662 352H31.338c-17.818 0-26.741-21.543-14.142-34.142l128.662-128.662c7.81-7.81 20.474-7.81 28.284 0l128.662 128.662c12.6 12.599 3.676 34.142-14.142 34.142z'%3E%3C/path%3E%3C/svg%3E");
}

.sorted-desc::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 512'%3E%3Cpath fill='black' d='M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z' /%3E%3C/svg %3E");
}

.w-name {
  width: 135px;
}

.w-kda {
  width: 90px;
}
</style>
