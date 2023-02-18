import * as Command from '../Command/Command.js'

const actuallyReplaceAll = () => {
  // TODO
}

export const replaceAll = async (state) => {
  const shouldReplace = await Command.execute('ConfirmPrompt.prompt', 'Replace all?', 'Replace All')
  if (!shouldReplace) {
    return
  }
  // TODO actually replace all
  return state
}
