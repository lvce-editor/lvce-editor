import * as NameAnonymousFunction from '../NameAnonymousFunction/NameAnonymousFunction.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as ViewletStates from '../ViewletStates/ViewletStates.js'

export const create = (moduleName, importFn, key) => {
  const lazyCommand = async (editor, ...args) => {
    const module = await importFn()
    const fn = module[key]
    // editor might have changed during import, need to apply function to latest editor
    const latestEditor = ViewletStates.getState(moduleName)
    if (typeof fn !== 'function') {
      throw new Error(`${moduleName}.${key} is not a function`)
    }
    return fn(latestEditor, ...args)
  }
  NameAnonymousFunction.nameAnonymousFunction(lazyCommand, `lazy/${key}`)
  return Viewlet.wrapViewletCommand(moduleName, lazyCommand)
}
