import * as OffscreenCanvas from '../OffscreenCanvas/OffscreenCanvas.js'
import * as TerminalModel from '../TerminalModel/TerminalModel.js'
import * as TerminalDataParser from '../TerminalDataParser/TerminalDataParser.js'

export const create = () => {
  // TODO create websocket ipc connection
  // TODO paint to offscreencanvas
}

export const render = (canvasId) => {
  const canvas = OffscreenCanvas.getCanvas(canvasId)
  console.log({ canvas })
  const ctx = canvas.getContext('2d', { alpha: false })
  ctx.fillStyle = 'red'
  ctx.font = '30px Arial'
  ctx.fillText('Terminal', 10, 50)
}

export const handleData = (terminalId, data) => {
  const ctx = OffscreenCanvas.getContext(terminalId)
  const terminalModel = TerminalModel.get(terminalId)
  const buffer = new Uint8Array(data.data)
  console.log('start parsing', buffer)
  // const decoded = new TextDecoder().decode(buffer)
  // console.log({ decoded })
  const text = TerminalDataParser.getText(buffer)
  ctx.fillStyle = 'red'
  ctx.font = '30px Arial'
  ctx.clearRect(0, 0, 500, 500)
  ctx.fillText(text, 10, 50)
  // // console.log({ arrayBuffer })
  // console.log({ data })
}
