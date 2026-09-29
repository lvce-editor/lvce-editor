import { writeFileSync } from 'node:fs'
import { Session } from 'node:inspector'
import * as Timeout from '../Timeout/Timeout.ts'

export const createProfile = async (): Promise<any> => {
  const session = new Session()
  session.connect()

  await new Promise((resolve: any) => {
    session.post('Profiler.enable', () => {
      session.post('Profiler.start', () => {
        // Invoke business logic under measurement here...

        Timeout.setTimeout(() => {
          session.post('Profiler.stop', (error: any, { profile }: any) => {
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
