import * as ViewletKeyBindings from './ViewletKeyBindings.js'

export const name = 'KeyBindings'

// prettier-ignore
export const Commands = {
  handleClick: ViewletKeyBindings.handleClick,
  handleInput: ViewletKeyBindings.handleInput,
  handleResizerClick: ViewletKeyBindings.handleResizerClick,
  handleResizerMove: ViewletKeyBindings.handleResizerMove,
  handleWheel: ViewletKeyBindings.handleWheel,
}

export const Css = [
  '/css/parts/ViewletKeyBindings.css',
  '/css/parts/InputBox.css',
]

export * from './ViewletKeyBindings.js'
