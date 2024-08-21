import * as Transferrable from '../Transferrable/Transferrable.js'

export const name = 'Transferrable'

export const Commands = {
  transferToRendererProcess: Transferrable.transferToRendererProcess,
  transferToWebView: Transferrable.transferToWebView,
}
