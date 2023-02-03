import * as ViewletKeyBindings from './ViewletKeyBindings.js'

export const name = 'KeyBindings'

// prettier-ignore
export const Commands = {
  handleClick: ViewletKeyBindings.handleClick,
  handleResizerClick: ViewletKeyBindings.handleResizerClick,
  handleResizerMove: ViewletKeyBindings.handleResizerMove,
  handleWheel: ViewletKeyBindings.handleWheel,
}

// prettier-ignore
export const LazyCommands = {
  handleInputClick: () => import('./ViewletKeyBindingsHandleInputClick.js'),
  handleBeforeInput: () => import('./ViewletKeyBindingsHandleBeforeInput.js'),
  handleInput: () => import('./ViewletKeyBindingsHandleInput.js'),
  handleInputBlur: () => import('./ViewletKeyBindingsHandleInputBlur.js'),
}

export const Css = ['/css/parts/ViewletKeyBindings.css', '/css/parts/VirtualInputBox.css', '/css/parts/InputBox.css']

export * from './ViewletKeyBindings.js'
