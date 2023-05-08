import * as ForwardViewletCommand from '../ForwardViewletCommand/ForwardViewletCommand.js'

export const focus = ForwardViewletCommand.forwardViewletCommand('focus')
export const handleBlur = ForwardViewletCommand.forwardViewletCommand('handleBlur')
export const handleDragOver = ForwardViewletCommand.forwardViewletCommand('handleDragOver')
export const handleDrop = ForwardViewletCommand.forwardViewletCommand('handleDrop')
export const handleContextMenu = ForwardViewletCommand.forwardViewletCommand('handleContextMenu')
export const handleClickAt = ForwardViewletCommand.forwardViewletCommand('handleClickAt')
export const updateEditingValue = ForwardViewletCommand.forwardViewletCommand('updateEditingValue')
export const handlePointerDown = ForwardViewletCommand.forwardViewletCommand('handlePointerDown')
