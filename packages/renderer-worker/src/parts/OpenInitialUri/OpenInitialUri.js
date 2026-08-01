import * as Command from '../Command/Command.js'

export const openInitialUri = async (href) => {
  const uri = new URL(href).searchParams.get('openUri')
  if (!uri) {
    return
  }
  await Command.execute('Main.openUri', uri)
}
