export function getMeta(metaName) {
  const metas = document.getElementsByTagName('meta');

  for (let i = 0; i < metas.length; i++) {
    if (metas[i].getAttribute('name') === metaName) {
      return metas[i].getAttribute('content');
    }
  }

  return '';
}

export function timeDifference(previous) {
  const current = new Date()
  const msPerMinute = 60 * 1000
  const msPerHour = msPerMinute * 60
  const msPerDay = msPerHour * 24
  const msPerWeek = msPerDay * 7
  const elapsed = current - previous

  if (elapsed < msPerMinute) {
    return Math.round(elapsed / 1000) + ' 초 전'
  } else if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute) + ' 분 전'
  } else if (elapsed < msPerDay) {
    return Math.round(elapsed / msPerHour) + ' 시간 전'
  } else if (elapsed < msPerWeek) {
    return Math.round(elapsed / msPerDay) + ' 일 전'
  } else {
    const dateOptions = { day: '2-digit', month: '2-digit', year: '2-digit' }
    return new Date(previous).toLocaleString(undefined, dateOptions).replace(/\//g, '.')
  }
}

export function secToTime(seconds) {
  const min = Math.floor(seconds / 60)
  let newSec = Math.floor(seconds - min * 60)
  newSec = newSec < 10 ? '0' + newSec : newSec
  
  return `${min}:${newSec}1`
}

export function sortTeamByRole(a, b) {
  const sortingArr = ['TOP', 'JUNGLE', 'MIDDLE', 'BOTTOM', 'UTILITY']
  return sortingArr.indexOf(a.role) - sortingArr.indexOf(b.role)
}

export function createCDragonAssetUrl(iconPath) {
  const name = iconPath.split('/assets/')[1].toLowerCase()
  return `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/${name}`
}

export function isRouteTopActive(currentRoute) {
  return {
    'bg-teal-700': this.$route.name === currentRoute || this.$route.meta.parent === currentRoute
  }
}

export function arrRankAsk(value, arr) {
	var sorted = arr.slice().sort(function(a,b){return a-b})
	var rank = sorted.indexOf(value)
	if(rank > -1) return rank+1
	return null
}