import * as TextSearchWorker from '../TextSearchWorker/TextSearchWorker.js'

export const wrapTextSearchCommand = (key) => {
  const fn = async (state, ...args) => {
    await TextSearchWorker.invoke(`TextSearch.${key}`, state.uid, ...args)
    const commands = await TextSearchWorker.invoke('TextSearch.render', state.uid)
    const patches = await TextSearchWorker.invoke('TextSearch.renderIncremental', state.uid)
    console.log({ commands, patches })
    let actualCommands = commands
    if (patches.length > 0) {
      const nonDomCommands = commands.filter((command) => command[0] !== 'Viewlet.setDom2')
      actualCommands = [['Viewlet.setPatches', state.uid, patches], ...nonDomCommands]
    }
    return {
      ...state,
      commands: actualCommands,
    }
  }
  return fn
}
