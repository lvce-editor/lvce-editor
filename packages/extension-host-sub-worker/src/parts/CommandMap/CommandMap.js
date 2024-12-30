import * as LoadFile from '../LoadFile/LoadFile.js'
import * as WebView from '../WebView/WebView.js'

export const commandMap = {
  'LoadFile.loadFile': LoadFile.loadFile,
  '_WebView.create': WebView.create,
  '_WebView.setPort': WebView.setPort,
}
