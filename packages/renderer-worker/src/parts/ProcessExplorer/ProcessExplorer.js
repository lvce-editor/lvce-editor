import * as OpenUri from '../OpenUri/OpenUri.js'

export const open = async () => {
  await OpenUri.openUri('process-explorer://')
}
