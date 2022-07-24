import * as SessionReplay from '../SessionReplay/SessionReplay.js'

export const writeFile = (content) => {
  throw new Error('not allowed')
}

export const readFile = async () => {
  const content = await SessionReplay.getSessionContent()
  return content
}
