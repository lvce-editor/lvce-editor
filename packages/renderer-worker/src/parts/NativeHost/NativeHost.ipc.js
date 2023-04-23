import * as NativeHost from './NativeHost.js'

export const name = 'NativeHost'

export const Commands = {
  handleMaximized: NativeHost.handleMaximized,
  handleMinimized: NativeHost.handleMinimized,
  handleUnmaximized: NativeHost.handleUnmaximized,
}
