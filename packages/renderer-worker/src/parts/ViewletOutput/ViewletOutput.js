import * as OutputChannel from '../OutputChannel/OutputChannel.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'
import * as Assert from '../Assert/Assert.js'

export const name = ViewletModuleId.Output

export const create = (id, uri, top, left, width, height) => {
  Assert.number(height)
  return {
    selectedIndex: -1,
    options: [],
    disposed: false,
    text: '',
    minLineY: 0,
    maxLineY: 0,
    deltaY: 0,
    finalDeltaY: 0,
    lines: [],
    top,
    left,
    width,
    height,
    itemHeight: 20,
  }
}

const toOption = (outputChannel) => {
  return {
    name: outputChannel.name,
    path: outputChannel.path,
  }
}

export const loadContent = async (state) => {
  const channels = await OutputChannel.getOutputChannels()
  const options = channels.map(toOption)
  const selectedIndex = 0
  return {
    ...state,
    options,
    selectedIndex,
  }
}

export const contentLoadedEffects = async (state) => {
  const { options, selectedIndex } = state
  const option = options[selectedIndex]
  const { path } = option
  await OutputChannel.open(0, path)
}

export const setOutputChannel = async (state, option) => {
  await OutputChannel.open(option)
  return {
    ...state,
    selectedOption: option,
    lines: [],
  }
}

export const handleData = (state, data) => {
  const { lines, height, itemHeight } = state
  const newLines = [...lines, ...data.split('\n')]
  const numberOfVisible = Math.ceil(height / itemHeight)
  const maxLineY = Math.min(newLines.length, numberOfVisible)
  console.log({ numberOfVisible })
  return {
    ...state,
    lines: newLines,
    maxLineY,
  }
}

export const dispose = async (state) => {
  // TODO close output channel in shared process
  await OutputChannel.close('Output')
  return {
    ...state,
    disposed: true,
  }
}

export const openFindWidget = async (state) => {
  // TODO use command.execute instead
  // TODO no lazy import here
}

export const closeFindWidget = async (state) => {}

export const handleError = (state, error) => {
  return {
    ...state,
    text: `${error}`,
  }
}

export const hasFunctionalResize = true

export const resize = (state) => {
  return state
}

export const hasFunctionalRender = true

const getVisibleLines = (state) => {
  const { lines, minLineY, maxLineY } = state
  return lines.slice(minLineY, maxLineY)
}

const renderLines = {
  isEqual(oldState, newState) {
    return (
      oldState.lines === newState.lines &&
      oldState.minLineY === newState.minLineY &&
      oldState.maxLineY === newState.maxLineY
    )
  },
  apply(oldState, newState) {
    const visibleLines = getVisibleLines(newState)
    console.log({ visibleLines })
    return [
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ ViewletModuleId.Output,
      /* method */ 'setLines',
      /* lines */ visibleLines,
    ]
  },
}

const renderOptions = {
  isEqual(oldState, newState) {
    return oldState.options === newState.options
  },
  apply(oldState, newState) {
    return [
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ ViewletModuleId.Output,
      /* method */ 'setOptions',
      /* options */ newState.options,
    ]
  },
}

export const render = [renderLines, renderOptions]
