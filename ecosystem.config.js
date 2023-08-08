module.exports = {
  apps: [
    {
      name: 'ZEM.GG-CLIENT',
      exec_mode: 'cluster',
      instances: 'max',
      script: './.output/server/index.mjs'
    }
  ]
}
