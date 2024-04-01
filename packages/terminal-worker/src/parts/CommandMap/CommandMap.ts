import * as OffscreenCanvas from '../OffscreenCanvas/OffscreenCanvas.ts'
import * as Terminal from '../Terminal/Terminal.ts'

export const commandMap = {
  'Terminal.create': Terminal.create,
  'Viewlet.send': Terminal.handleMessage,
  'Terminal.handleBlur': Terminal.handleBlur,
  'Terminal.handleKeyDown': Terminal.handleKeyDown,
  'Terminal.handleMouseDown': Terminal.handleMouseDown,
  'OffscreenCanvas.handleResult': OffscreenCanvas.handleResult,
}
