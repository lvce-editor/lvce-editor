import * as TerminalProcess from '../TerminalProcess/TerminalProcess.ts'

export const create = async (
  canvasText: OffscreenCanvas,
  canvasCursor: OffscreenCanvas,
  id: number,
  cwd: string,
  command: string,
  args: readonly string[],
) => {
  await TerminalProcess.listen()
  await TerminalProcess.invoke('Terminal.create', id, cwd, command, args)
  console.log({ canvasText, canvasCursor })
}

export const handleMessage = (id, method, ...args) => {
  console.log({ id, method, args })
}
