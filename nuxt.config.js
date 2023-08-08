require('dotenv').config()

export default {
  server: {
    host: '0.0.0.0',
    port: Number(process.env.PORT)
  },

  loading: {
    color: '#ff9600',
    height: '5px'
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: '롤 전적 검색 ZEM.GG | 소환사 인분, 소환사 등급 확인',
    htmlAttrs: {
      lang: 'kr'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'title', name: 'title', content: '롤 전적 검색 ZEM.GG | 소환사 인분, 소환사 등급 확인' },
      { hid: 'description', name: 'description', content: '롤 소환사 전적, 모든 게임의 전적, KDA, 승률 인분 등급 확인 하실수 있습니다. 지금 바로 당신의 소환사명을 검색해보세요!' },
      { name: 'format-detection', content: 'telephone=no' },
      
      { hid: 'og:title', name: 'og:title', content: '롤 전적 검색 ZEM.GG | 소환사 인분, 소환사 등급 확인' },
      { hid: 'og:description', name: 'og:description', content: '롤 소환사 전적, 모든 게임의 전적, KDA, 승률 인분 등급 확인 하실수 있습니다. 지금 바로 당신의 소환사명을 검색해보세요!' },
      
      { hid: 'og:locale', property: 'og:locale', content: 'ko_KR' },
      { hid: 'og:type', property: 'og:type', content: 'website' },
      { hid: 'og:site_name', property: 'og:site_name', content: process.env.SITE_NAME },
      { hid: 'og:url', property: 'og:url', content: process.env.SITE_URL },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@/assets/css/tailwind.css'
  ],

  postcss: {
    // Add plugin names as key and arguments as value
    // Install them before as dependencies with npm or yarn
    plugins: {
      // Disable a plugin by passing false as value 
      'postcss-url': false,
      'postcss-nested': {},
      'postcss-responsive-type': {},
      'postcss-hexrgba': {}
    },
    preset: {
      // Change the postcss-preset-env settings
      autoprefixer: {
        grid: true
      }
    }
  },


  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '@plugins/fillters.js'
  ],

  image: {
    domains: ['raw.communitydragon.org'],

    provider: 'cloudinary',
    cloudinary: {
      baseURL: 'https://res.cloudinary.com/zemgg/image/fetch/'
    }
  },
  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    '@nuxtjs/eslint-module',
    '@nuxt/postcss8',
    '@nuxtjs/device',
    '@nuxtjs/dotenv'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/axios',
    '@nuxt/image'
  ],

  axios: {
    // 모듈 설정
    baseURL: process.client ? process.env.API_URL : process.env.LOCAL_API_URL
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    postcss: {
      plugins: {
        'postcss-preset-env': {
          autoprefixer: {},
        },
        tailwindcss: {},
        autoprefixer: {},
      },
    }
  }
}
