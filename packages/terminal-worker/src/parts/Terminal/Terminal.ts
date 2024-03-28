import * as TerminalProcess from '../TerminalProcess/TerminalProcess.ts'
import * as TerminalEmulator from '../TerminalEmulator/TerminalEmulator.ts'
import * as TerminalEmulatorState from '../TerminalEmulatorState/TerminalEmulatorState.ts'
import * as ToUint8Array from '../ToUint8Array/ToUint8Array.ts'

export const create = async (
  canvasText: OffscreenCanvas,
  canvasCursor: OffscreenCanvas,
  id: number,
  cwd: string,
  command: string,
  args: readonly string[],
) => {
  await TerminalProcess.listen()
  const emulator = await TerminalEmulator.create({
    offscreenCanvasCursor: canvasCursor,
    offscreenCanvasText: canvasText,
    focusTextArea() {
      // TODO
    },
    handleInput() {
      // TODO
    },
  })
  TerminalEmulatorState.set(id, emulator)
  await TerminalProcess.invoke('Terminal.create', id, cwd, command, args)
}

export const handleMessage = (id, method, ...args) => {
  const emulator = TerminalEmulatorState.get(id)
  if (method === 'handleData') {
    const data = args[0]
    const parsedData = ToUint8Array.toUint8Array(data)
    emulator.write(parsedData)
  }
}

export const write = (id, data) => {
  const emulator = TerminalEmulatorState.get(id)
  emulator.write(data)
}

export const handleBlur = (id) => {
  const emulator = TerminalEmulatorState.get(id)
  emulator.handleBlur()
}

export const handleKeyDown = (id, key) => {
  const emulator = TerminalEmulatorState.get(id)
  emulator.handleKeyDown(key)
}

export const handleMouseDown = (id) => {
  const emulator = TerminalEmulatorState.get(id)
  emulator.handleMouseDown()
}
