export const maps = { 10: 'The Twisted Treeline', 11: "Summoner's Rift", 12: 'Howling Abyss' }

export const gameModes = {
  0: {
    type: 'Normal',
    name: '커스텀',
  },
  900: {
    type: 'Normal',
    name: '우르프',
  },
  450: {
    type: 'Normal',
    name: '칼바람',
  },
  400: {
    type: 'Normal',
    name: 'DRAFT 5vs5',
  },
  420: {
    type: 'Ranked',
    name: '솔랭',
  },
  430: {
    type: 'Normal',
    name: '일반',
  },
  440: {
    type: 'Ranked',
    name: '자유 5',
  },
  460: {
    type: 'Normal',
    name: 'BLIND 3vs3',
  },
  470: {
    type: 'Ranked',
    name: '자유 3',
  },
  700: {
    type: 'Ranked',
    name: 'CLASH',
  },
  800: {
    type: 'Bot',
    name: '3vs3 중급 AI',
  },
  810: {
    type: 'Bot',
    name: '3vs3 Co-op vs. AI (Intro)',
  },
  820: {
    type: 'Bot',
    name: '3vs3 Co-op vs. AI (Beginner)',
  },
  830: {
    type: 'Bot',
    name: '입문',
  },
  840: {
    type: 'Bot',
    name: 'Co-op vs. AI (Beginner)',
  },
  850: {
    type: 'Bot',
    name: '중급 AI',
  },
  920: {
    type: 'Normal',
    name: 'PORO KING',
  },
  1020: {
    type: 'Normal',
    name: 'One for All'
  },
  1300: {
    type: 'Normal',
    name: 'Nexus Blitz'
  },
  1400: {
    type: 'Normal',
    name: 'Ultimate Spellbook'
  }
}

const colorValues = {
  green: '54,148,109',
  red: '197,85,93',
  purple: '141,116,217',
  teal: '56 178 172',
  yellow: '166,176,134',
  orange: '184,137,101',
  brown: '161,127,134',
  blue: '55, 118, 179',
}

export const colors = {
  kills: colorValues['green'],
  deaths: colorValues['red'],
  assists: colorValues['purple'],
  minions: colorValues['teal'],
  vision: colorValues['yellow'],
  gold: colorValues['orange'],
  dmgChamp: colorValues['red'],
  dmgObj: colorValues['yellow'],
  dmgTaken: colorValues['red'],
  kp: colorValues['brown'],

  winrate: colorValues['green'],
  playrate: colorValues['purple'],
  wins: colorValues['green'],
  count: colorValues['purple'],
  kda: colorValues['blue'],
  gameLength: colorValues['green'],
}
