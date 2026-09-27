import * as SharedProcess from '../SharedProcess/SharedProcess.js'

export const write = async (message, invoke = SharedProcess.invoke) => {
  try {
    await invoke('AutoUpdater.writeLog', message)
  } catch (error) {
    // Diagnostics must not prevent checking for updates (including on the web).
    console.warn('Failed to persist update diagnostics', error)
  }
}

export const run = async (method, callback, writeLog = write) => {
  await writeLog(`Update worker: ${method} started`)
  try {
    const result = await callback()
    const outcome = result?.error ? `failed: ${result.error}` : 'returned'
    await writeLog(`Update worker: ${method} ${outcome}`)
    return result
  } catch (error) {
    const message = error instanceof Error ? error.stack || error.message : String(error)
    await writeLog(`Update worker: ${method} failed: ${message}`)
    throw error
  }
}
