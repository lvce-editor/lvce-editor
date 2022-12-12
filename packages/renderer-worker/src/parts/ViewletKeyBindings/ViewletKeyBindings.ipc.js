import * as ViewletKeyBindings from './ViewletKeyBindings.js'

export const name = 'KeyBindings'

// prettier-ignore
export const Commands = {
  handleClick: ViewletKeyBindings.handleClick,
  handleInput: ViewletKeyBindings.handleInput,
  handleWheel: ViewletKeyBindings.handleWheel,
  handleResizerMove: ViewletKeyBindings.handleResizerMove,
  handleResizerClick: ViewletKeyBindings.handleResizerClick,
}

export const Css = '/css/parts/ViewletKeyBindings.css'

export * from './ViewletKeyBindings.js'
