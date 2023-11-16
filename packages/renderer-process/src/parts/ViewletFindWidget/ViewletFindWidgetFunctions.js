import * as ForwardViewletCommand from '../ForwardViewletCommand/ForwardViewletCommand.js'

export const close = ForwardViewletCommand.forwardViewletCommand('close')
export const focusNext = ForwardViewletCommand.forwardViewletCommand('focusNext')
export const focusPrevious = ForwardViewletCommand.forwardViewletCommand('focusPrevious')
export const handleBlur = ForwardViewletCommand.forwardViewletCommand('handleBlur')
export const handleFocus = ForwardViewletCommand.forwardViewletCommand('handleFocus')
export const handleInput = ForwardViewletCommand.forwardViewletCommand('handleInput')
