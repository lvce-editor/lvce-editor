import * as TitleBarMenuBar from '../TitleBarMenuBar/TitleBarMenuBar.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'

export const name = 'TitleBar'

export const create = () => {
  return {
    disposed: false,
    titleBarEntries: [],
  }
}

export const loadContent = async (state) => {
  const titleBarEntries = await TitleBarMenuBar.getEntries()
  return {
    ...state,
    titleBarEntries,
  }
}

export const contentLoaded = async (state) => {
  await RendererProcess.invoke(
    /* Viewlet.send */ 3024,
    /* id */ 'TitleBar',
    /* method */ 'menuSetEntries',
    /* titleBarEntries */ state.titleBarEntries
  )
}

export const focus = async () => {
  await TitleBarMenuBar.focus()
}

export const dispose = (state) => {
  return {
    ...state,
    disposed: true,
  }
}

export const resize = (state, dimensions) => {
  return {
    newState: {
      ...state,
      ...dimensions,
    },
    commands: [],
  }
}
