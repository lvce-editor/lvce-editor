import * as Assert from '../Assert/Assert.ts'
import * as MainAreaWorker from '../MainAreaWorker/MainAreaWorker.js'
import * as Preferences from '../Preferences/Preferences.js'
import { renderMainAreaPending } from '../RenderMainAreaPending/RenderMainAreaPending.ts'
import { resolveInternalSourceUri } from '../ResolveInternalSourceUri/ResolveInternalSourceUri.ts'

const loadingDelay = 500
const loadingTimeout = Symbol('loadingTimeout')
const commandsThatOpenEditors = new Set(['handleClickTab', 'openInput', 'openUri', 'openUris', 'restoreClosedTab', 'selectTab'])

const shouldRenderLoadingState = (key: string): boolean => {
  return commandsThatOpenEditors.has(key) && Preferences.get('workbench.editor.showTabsWhileLoading') === true
}

const resolveOpenUriArgs = async (key: string, args: readonly any[]): Promise<readonly any[]> => {
  if (key !== 'openUri' || args.length === 0) {
    return args
  }
  const [options, ...rest] = args
  if (typeof options === 'string') {
    return [await resolveInternalSourceUri(options), ...rest]
  }
  if (typeof options?.uri === 'string') {
    return [
      {
        ...options,
        uri: await resolveInternalSourceUri(options.uri),
      },
      ...rest,
    ]
  }
  return args
}

const invokeMainAreaCommand = async (key: string, uid: number, args: readonly any[]): Promise<void> => {
  const resolvedArgs = await resolveOpenUriArgs(key, args)
  const commandPromise = MainAreaWorker.invoke(`MainArea.${key}`, uid, ...resolvedArgs)
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
      await Promise.all([commandPromise, renderMainAreaPending(uid)])
    }
  } finally {
    clearTimeout(timeoutId)
  }
}

export const wrapMainAreaCommand = (key: string) => {
  const fn = async (state, ...args) => {
    const commands: any[] = []
    if (key === 'resize') {
      const resizeCommands = await MainAreaWorker.invoke(`MainArea.${key}`, state.uid, ...args)
      Assert.array(resizeCommands)
      commands.push(...resizeCommands)
    } else {
      await invokeMainAreaCommand(key, state.uid, args)
    }
    const diffResult = await MainAreaWorker.invoke('MainArea.diff2', state.uid)
    if (diffResult.length > 0) {
      const renderCommands = await MainAreaWorker.invoke('MainArea.render2', state.uid, diffResult)
      commands.push(...renderCommands)
    }
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
