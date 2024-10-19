import * as ViewletKeyBindings from './ViewletKeyBindings.js'
import * as KeyBindingsViewWorker from '../KeyBindingsViewWorker/KeyBindingsViewWorker.js'

export const Commands = {
  handleClick: ViewletKeyBindings.handleClick,
  handleInput: ViewletKeyBindings.handleInput,
  handleResizerClick: ViewletKeyBindings.handleResizerClick,
  handleResizerMove: ViewletKeyBindings.handleResizerMove,
  handleWheel: ViewletKeyBindings.handleWheel,
  handleDoubleClick: ViewletKeyBindings.handleDoubleClick,
  handleDefineKeyBindingDisposed: ViewletKeyBindings.handleDefineKeyBindingDisposed,
  focusNext: ViewletKeyBindings.focusNext,
  focusPrevious: ViewletKeyBindings.focusPrevious,
  focusFirst: ViewletKeyBindings.focusFirst,
  focusLast: ViewletKeyBindings.focusLast,
  handleContextMenu: ViewletKeyBindings.handleContextMenu,
}

const wrapCommand = (fn) => {
  const wrapped = async (state, ...args) => {
    const newState = await fn(state, ...args)
    // TODO ask worker
    const result = await KeyBindingsViewWorker.invoke('KeyBindings.render', state, newState)
    newState.commands = result
    return newState
  }
  return wrapped
}

for (const [key, value] of Object.entries(Commands)) {
  Commands[key] = wrapCommand(value)
}
