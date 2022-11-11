import * as Command from '../Command/Command.js'

export const openBackgroundTab = async (state, url) => {
  const simpleBrowserUrl = `simple-browser://`
  await Command.execute('Main.openBackgroundTab', simpleBrowserUrl, {
    iframeSrc: url,
  })
  // TODO
  return state
}
