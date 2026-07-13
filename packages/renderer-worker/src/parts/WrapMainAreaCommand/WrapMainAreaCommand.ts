import * as Assert from '../Assert/Assert.ts'
import * as MainAreaWorker from '../MainAreaWorker/MainAreaWorker.js'
import * as Preferences from '../Preferences/Preferences.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'

const loadingDelay = 500
const loadingTimeout = Symbol('loadingTimeout')
const commandsThatOpenEditors = new Set(['handleClickTab', 'openInput', 'openUri', 'openUris', 'restoreClosedTab', 'selectTab'])

const shouldRenderLoadingState = (key: string): boolean => {
  return commandsThatOpenEditors.has(key) && Preferences.get('workbench.editor.showTabsWhileLoading') === true
}

const renderPendingState = async (uid: number): Promise<void> => {
  const diffResult = await MainAreaWorker.invoke('MainArea.diff2', uid)
  if (diffResult.length === 0) {
    return
  }
  const commands = await MainAreaWorker.invoke('MainArea.render2', uid, diffResult)
  if (commands.length === 0) {
    return
  }
  await RendererProcess.invoke('Viewlet.sendMultiple', commands)
}

const invokeMainAreaCommand = async (key: string, uid: number, args: readonly any[]): Promise<void> => {
  const commandPromise = MainAreaWorker.invoke(`MainArea.${key}`, uid, ...args)
  if (!shouldRenderLoadingState(key)) {
    await commandPromise
    return
  }

  let timeoutId: ReturnType<typeof setTimeout> | undefined
  const timeoutPromise = new Promise<typeof loadingTimeout>((resolve) => {
    timeoutId = setTimeout(() => resolve(loadingTimeout), loadingDelay)
  })

  try {
    const result = await Promise.race([commandPromise, timeoutPromise])
    if (result === loadingTimeout) {
      await Promise.all([commandPromise, renderPendingState(uid)])
    }
  } finally {
    clearTimeout(timeoutId)
  }
}

export const wrapMainAreaCommand = (key: string) => {
  const fn = async (state, ...args) => {
    if (key === 'resize') {
      const commands = await MainAreaWorker.invoke(`MainArea.${key}`, state.uid, ...args)
      Assert.array(commands)
      return {
        ...state,
        commands,
      }
    }
    await invokeMainAreaCommand(key, state.uid, args)
    const diffResult = await MainAreaWorker.invoke('MainArea.diff2', state.uid)
    if (diffResult.length === 0) {
      return state
    }
    const commands = await MainAreaWorker.invoke('MainArea.render2', state.uid, diffResult)
    if (commands.length === 0) {
      return state
    }
    return {
      ...state,
      commands,
    }
  }
  return fn
}
