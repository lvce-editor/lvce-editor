import * as SessionReplay from './SessionReplay.js'

export const name = 'SessionReplay'

// prettier-ignore
export const Commands = {
  downloadSession: SessionReplay.downloadSession,
  openSession: SessionReplay.openSession,
  replayCurrentSession: SessionReplay.replayCurrentSession,
  replaySession: SessionReplay.replaySession,
}
