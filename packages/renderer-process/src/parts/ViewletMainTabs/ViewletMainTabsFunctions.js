import * as ForwardViewletCommand from '../ForwardViewletCommand/ForwardViewletCommand.js'

export const closeEditor = ForwardViewletCommand.forwardViewletCommand('closeEditor')
export const handleTabClick = ForwardViewletCommand.forwardViewletCommand('handleTabClick')
export const handleTabsWheel = ForwardViewletCommand.forwardViewletCommand('handleTabsWheel')
export const handleTabContextMenu = ForwardViewletCommand.forwardViewletCommand('handleTabContextMenu')
export const handleTabsPointerOver = ForwardViewletCommand.forwardViewletCommand('handleTabsPointerOver')
export const handleTabsPointerOut = ForwardViewletCommand.forwardViewletCommand('handleTabsPointerOut')
