import { app } from 'electron'

export const setUserDataPath = (value) => {
  app.setPath('userData', value)
}

export const setSessionDataPath = (value) => {
  app.setPath('sessionData', value)
}

export const setCrashDumpsPath = (value) => {
  app.setPath('crashDumps', value)
}

export const setLogsPath = (value) => {
  app.setPath('logs', value)
}
