import * as NativeHost from './NativeHost.js'

export const name = 'NativeHost'

export const Commands = {
  handleMaximized: NativeHost.handleMaximized,
  handleUnmaximized: NativeHost.handleUnmaximized,
  handleMinimized: NativeHost.handleMinimized,
}
