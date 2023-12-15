import { app } from 'electron'

export const requestSingleInstanceLock = (argv) => {
  return app.requestSingleInstanceLock(argv)
}
