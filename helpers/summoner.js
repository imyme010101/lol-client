import { createCDragonAssetUrl, secToTime, timeDifference } from '@/helpers/functions.js'
import { maps, gameModes } from '@/data/data.js'

import { mean } from "mathjs"

const leaguesNumbers = { 'I': 1, 'II': 2, 'III': 3, 'IV': 4 }

export function getPrimarRune(perks, runes) {
  const primaryRune = perks.selected.length ? runes.perks[perks.selected[0]] : null
  return primaryRune ? createCDragonAssetUrl(primaryRune.icon) : null
}

export function getSecondaryRune(perks, runes) {
  const secondaryRune = runes.perkstyles[perks.secondaryStyle]
  return  secondaryRune ? createCDragonAssetUrl(secondaryRune.icon) : null
}

export function createMatchData(matches, runes) {
  for (const match of matches) {
    // Runes
    match.primaryRune = getPrimarRune(match.perks, runes)
    match.secondaryRune = getSecondaryRune(match.perks, runes)

    const date = new Date(match.date)
    const dateOptions = { day: '2-digit', month: '2-digit', year: 'numeric' }
    const timeOptions = { hour12: false, hour: '2-digit', minute: '2-digit' }
    match.fullDate = { date: date.toLocaleString(undefined, dateOptions), time: date.toLocaleString(undefined, timeOptions) }
    match.date = timeDifference(match.date)

    match.map = maps[match.map]
    match.gamemode = gameModes[match.gamemode]
    if (!match.gamemode) {
      match.gamemode = { name: 'Unknown gamemode' }
    }
  } // end loop matches

  return matches
}

export function createBasicSummonerData(RiotData) {
  if(typeof RiotData.ranked == 'undefined') {
    RiotData.soloQ = getLeagueData(RiotData.soloQ, 'Solo/Duo')

    RiotData.flex5v5 = getLeagueData(RiotData.flex5v5, 'Flex 5vs5')

    RiotData.flex3v3 = getLeagueData(RiotData.flex3v3, 'Flex 3vs3')
    
    if (!RiotData.soloQ) {
      RiotData.soloQ = {
        fullRank: 'Unranked',
        rankImgLink: '/img/ranks/unranked.webp',
        leaguePoints: 0,
        wins: 0,
        losses: 0,
        winrate: '0%',
        name: 'Solo/Duo'
      }
    }

    if (!RiotData.flex5v5) {
      RiotData.flex5v5 = {
        fullRank: 'Unranked',
        rankImgLink: '/img/ranks/unranked.webp',
        leaguePoints: 0,
        tier: null,
        wins: 0,
        losses: 0,
        winrate: '0%',
        name: '자유랭크'
      }
    }
  } else {
    RiotData.ranked.soloQ = getLeagueData(RiotData.ranked.soloQ, 'Solo/Duo')
    RiotData.ranked.flex5v5 = getLeagueData(RiotData.ranked.flex5v5, 'Flex 5vs5')
    RiotData.ranked.flex3v3 = getLeagueData(RiotData.ranked.flex3v3, 'Flex 3vs3')
    
    if (!RiotData.ranked.soloQ) {
      RiotData.ranked.soloQ = {
        fullRank: 'Unranked',
        rankImgLink: '/img/ranks/unranked.webp',
        leaguePoints: 0,
        wins: 0,
        losses: 0,
        winrate: '0%',
        name: 'Solo/Duo'
      }
    }

    if (!RiotData.ranked.flex5v5) {
      RiotData.ranked.flex5v5 = {
        fullRank: 'Unranked',
        rankImgLink: '/img/ranks/unranked.webp',
        leaguePoints: 0,
        tier: null,
        wins: 0,
        losses: 0,
        winrate: '0%',
        name: '자유랭크'
      }
    }
  }
  
  return RiotData
}

export function createRecordsData(recordsDto) {
  const records = recordsDto.reduce((acc, record) => {
    acc[record.what] = record
    return acc
  }, {})

  records.game_duration.amount = secToTime(records.game_duration.amount)
  records.gold.amount =  records.gold.amount.toLocaleString()
  records.damage_taken.amount = records.damage_taken.amount.toLocaleString()
  records.damage_dealt_champions.amount = records.damage_dealt_champions.amount.toLocaleString()
  records.damage_dealt_objectives.amount = records.damage_dealt_objectives.amount.toLocaleString()
  records.kp.amount = `${records.kp.amount}%`
  records.time_spent_living.amount = secToTime(records.time_spent_living.amount)
  records.heal.amount = records.heal.amount.toLocaleString()

  return records
}

function getLeagueData(leagueData, leagueName) {
  if (!leagueData || typeof leagueData == 'undefined') return null

  leagueData.rankImgLink = getRankImg(leagueData)
  leagueData.name = leagueName
  return leagueData
}

export function getRankImg(leagueData) {
  const tier = leagueData.tier.toLowerCase()
  return `/img/ranks/${tier}.webp`
}

export function getSummonerScore(matches, scores, tier, type) {
  
  if(tier == null || matches.length < 3) {
    return null
  } else {
    const nMatches = matches.map((a1) => {
      if(a1.role !== 'NONE' && a1.result !== 'Remake') {
        return a1.stats[type]
      }
    }).filter((a1) => { if(typeof a1 !== "undefined" && a1 !== null && a1 !== "") { return a1 } })
    
    if(nMatches.length < 3) {
      return null
    } else {
      const myAvg = Math.floor(mean(nMatches))
      const tierAvg = Math.floor(Number(scores[type + 'Avgs'][tier.toLowerCase()]))

      const score = Math.floor((((Number(myAvg) - Number(scores[type + 'Avgs'][tier.toLowerCase()])) / Number(scores[type + 'Stds'][tier.toLowerCase()])) * 10) + 50)
      const percent = (myAvg / tierAvg * 50) > 100 ? 100 : (myAvg / tierAvg * 50)

      let inbun = 0
      inbun = ((Number(score) - 50) / 10) + 0.1
      if(inbun < 0) {
        inbun = Math.ceil(Math.abs(inbun)) + inbun
      } else {
        inbun = inbun + 1
      }

      return {percent: percent, score: score, inbun: Number(inbun.toFixed(1))}
    }
  }
}

export function getSummonerScoreTotal(summonerScores) {
  const inbun = (Number(summonerScores['vision']['inbun'] + summonerScores['kills']['inbun'] + summonerScores['assists']['inbun']) / 3).toFixed(1)
  
  return {score: 0, inbun: Number(inbun)}
}

export function getCarryScore(matches) {
  const kMatches = matches.map((a1) => {
    if(a1.role !== 'NONE' && a1.result !== 'Remake') {
      return a1.stats['kpRank']
    }
  }).filter((a1) => {
    if(typeof a1 !== "undefined" && a1 !== null && a1 !== "") {
      return a1
    }
  })
  const kCarryScoreAvg = Number(Math.floor(mean(kMatches).toFixed(1)))

  const dMatches = matches.map((a1) => {
    if(a1.role !== 'NONE' && a1.result !== 'Remake') {
      return a1.stats['killsRank']
    }
  }).filter((a1) => {
    if(typeof a1 !== "undefined" && a1 !== null && a1 !== "") {
      return a1
    }
  })
  const dCarryScoreAvg = Number(Math.floor(mean(dMatches).toFixed(1)))

  const vMatches = matches.map((a1) => {
    if(a1.role !== 'NONE' && a1.result !== 'Remake') {
      return a1.stats['visionRank']
    }
  }).filter((a1) => {
    if(typeof a1 !== "undefined") {
      return a1
    }
  })
  const vCarryScoreAvg = Number(Math.floor(mean(vMatches).toFixed(1)))
  
  return Number(mean([kCarryScoreAvg, dCarryScoreAvg, vCarryScoreAvg]).toFixed(1))
}

export function getTeamScore(matches) {
  const nMatches = matches.map((a1) => {
    if(a1.role !== 'NONE' && a1.result !== 'Remake') {
      return a1.stats['teamScore']
    }
  }).filter((a1) => {
    if(typeof a1 !== "undefined") {
      return a1
    }
  })
  
  
  if(nMatches.length < 3) {
    return null
  } else {
    const myTeamScoreAvg = Number(mean(nMatches).toFixed(1))
    let result = ''
    
    if(myTeamScoreAvg < -3)
      result = '저주'
    else if(myTeamScoreAvg >= -3 && myTeamScoreAvg < -1.5)
      result = '빡침'
    else if(myTeamScoreAvg >= -1.5 && myTeamScoreAvg < 0)
      result = '나쁨'
    else if(myTeamScoreAvg >= 0 && myTeamScoreAvg < 1.5)
      result = '억울'
    else if(myTeamScoreAvg >= 1.5 && myTeamScoreAvg < 2)
      result = '보통'
    else if(myTeamScoreAvg >= 2 && myTeamScoreAvg < 3)
      result = '좋음'
    else if(myTeamScoreAvg >= 3)
      result = '숟가락'

    return {score: 0, score: myTeamScoreAvg, text: result}
  }
}

export function getColorTeamUn(score) {
  let result = ''
  if(score < -3)
    result = '#e84057'
  else if(score >= -3 && score < -1.5)
    result = '#e84057'
  else if(score >= -1.5 && score < 0)
    result = '#f17989'
  else if(score >= 0 && score < 1.5)
    result = '#f17989'
  else if(score >= 1.5 && score < 2)
    result = '#5383E8'
  else if(score >= 2 && score < 3)
    result = '#5383E8'
  else if(score >= 3)
    result = '#2c7a7b'

  return result
}