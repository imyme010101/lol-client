<template>
  <div>
    <template v-if="$device.isDesktop">
      <div class="relative h-screen">

        <div class="home-character">
          <nuxt-img :src="`https://zem.gg/img/home_bg/${bgNumber}.png`" format="webp" height="345" />
        </div>

        <div class="relative flex flex-col items-center justify-center h-full">
          <div class="relative flex flex-col items-center w-full">
            <div
              class="logo text-c-0"
            >
              ZEM.GG
            </div>
            <SearchForm @formSubmit="redirect" :homepage="true" />
          </div>
        </div>
      </div>
    </template>

    <template v-if="$device.isMobile">
      <div class="relative overflow-hidden h-screen">

        <div class="home-character-m">
          <nuxt-img :src="`https://zem.gg/img/home_bg/${bgNumber}.png`" format="webp" height="329" />
        </div>

        <div class="relative flex flex-col items-center justify-center px-4 -mt-36 md:mt-0 h-full">
          <div class="relative flex flex-col items-center w-full max-w-lg">
            <div
              class="logo-m text-c-0"
            >
              ZEM.GG
            </div>
            <SearchForm @formSubmit="redirect" :homepage="true" :isOpen="true" />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { randomInt } from "mathjs"
import SearchForm from '@/components/Form/SearchForm.vue'


export default {
  layout: (ctx) => ctx.$device.isDesktop ? 'home' : 'home.m',

  components: {
    // LazyBackground,
    SearchForm
  },
  
  computed: {
    async asyncData({ store, params }) {
      await store.dispatch('cdragon/getRunes', {})
    },
    
    bgNumber() {
      return randomInt(1, 5)
    }
  },

  methods: {
    toggleRegion() {
    },
    redirect(summoner, region) {
      this.$router.push(`/summoner/${region}/${summoner}`)
    }
  }
}
</script>

<style scoped>
.home-character {
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
  width: 315px;
  top: 65px;
}
.home-character-m {
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
  top: 20px;
}
.logo {
  width: 97%;
  text-align: center;
  letter-spacing: 23px;
  display: inline;
  margin-bottom: 30px;
  font-size: 5em;
  font-weight: bold;
  font-family: 'GongGothicBold';
}
.logo-m {
  width: 97%;
  text-align: center;
  letter-spacing: 23px;
  display: inline;
  margin-bottom: 30px;
  font-size: 3em;
  font-weight: bold;
  font-family: 'GongGothicBold';

}
</style>
