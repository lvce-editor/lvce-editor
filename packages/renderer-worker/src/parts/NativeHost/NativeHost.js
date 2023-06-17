import * as GlobalEventBus from '../GlobalEventBus/GlobalEventBus.js'
import * as GlobalEventType from '../GlobalEventType/GlobalEventType.js'
import * as NativeHostState from '../NativeHostState/NativeHostState.js'

export const handleMaximized = () => {
  NativeHostState.setMaximized(true)
  GlobalEventBus.emitEvent(GlobalEventType.HandleMaximized)
}

export const handleUnmaximized = () => {
  NativeHostState.setMaximized(false)
  GlobalEventBus.emitEvent(GlobalEventType.HandleUnmaximized)
}

export const handleMinimized = () => {
  NativeHostState.setMinimized(true)
  GlobalEventBus.emitEvent(GlobalEventType.HandleMinimized)
}
