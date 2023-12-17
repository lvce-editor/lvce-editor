import { writeFileSync } from 'node:fs'
import { Session } from 'node:inspector'
import * as Timeout from '../Timeout/Timeout.js'

export const createProfile = async () => {
  const session = new Session()
  session.connect()

  await new Promise((resolve) => {
    session.post('Profiler.enable', () => {
      session.post('Profiler.start', () => {
        // Invoke business logic under measurement here...

        Timeout.setTimeout(() => {
          session.post('Profiler.stop', (error, { profile }) => {
            // Write profile to disk, upload, etc.
            if (!error) {
              writeFileSync('/tmp/vscode-profile.cpuprofile', JSON.stringify(profile))
            }
          })
        }, 15000)
        // some time later...
      })
    })
  })
}
