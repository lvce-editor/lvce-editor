import * as SessionReplay from './SessionReplay.js'

export const name = 'SessionReplay'

export const Commands = {
  downloadSession: SessionReplay.downloadSession,
  openSession: SessionReplay.openSession,
  replayCurrentSession: SessionReplay.replayCurrentSession,
  replaySession: SessionReplay.replaySession,
}
