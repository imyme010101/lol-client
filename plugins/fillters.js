import Vue from 'vue'

Vue.filter('capitalize', (value) => {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
})

Vue.filter('kilo', (value) => {
  return `${+(value / 1000).toFixed(1)}k`
})

Vue.filter('secToTime', (sec, dotNotation = false) => {
  if (isNaN(sec)) return 0

  const min = Math.floor(sec / 60)
  let newSec = Math.floor(sec - min * 60)
  newSec = newSec < 10 ? '0' + newSec : newSec

  return dotNotation ? `${min}:${newSec}` : `${min}분 ${newSec}초`
})

Vue.filter('percent', (value) => {
  return `${+value.toFixed(1)}%`
})

Vue.filter('round', (value, decimals = 2) => {
  if (isNaN(value)) return 0

  return parseFloat(value.toFixed(decimals))
})

Vue.filter('number', (value) => {
  if (isNaN(value)) return 0

  return value.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
})

Vue.filter('percentage', (value, total) => {
  return (value / total * 100).toFixed(1)
})