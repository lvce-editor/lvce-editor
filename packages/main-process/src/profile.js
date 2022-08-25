const inspector = require('node:inspector')
const fs = require('node:fs')

const session = new inspector.Session()
session.connect()

session.post('Profiler.enable', () => {
  session.post('Profiler.start', async () => {
    // Invoke business logic under measurement here...

    console.log('start require')
    require('./mainProcessMain.js')
    console.log('finish require')
    // some time later...
    session.post('Profiler.stop', (err, { profile }) => {
      // Write profile to disk, upload, etc.
      if (!err) {
        fs.writeFileSync('./profile.cpuprofile', JSON.stringify(profile))
      }
    })
  })
})
