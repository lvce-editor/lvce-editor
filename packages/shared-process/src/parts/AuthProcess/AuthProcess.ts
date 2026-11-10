import { randomUUID } from 'node:crypto'
import * as HandleIpc from '../HandleIpc/HandleIpc.ts'
import * as JsonRpc from '../JsonRpc/JsonRpc.ts'
import * as LaunchAuthProcess from '../LaunchAuthProcess/LaunchAuthProcess.ts'

interface Generation {
  readonly connections: Set<string>
  readonly ipc: Promise<any>
}

let current: Generation | undefined
const connections = new Map<string, Generation>()

const forget = (generation: Generation): void => {
  if (current === generation) {
    current = undefined
  }
  for (const id of generation.connections) {
    connections.delete(id)
  }
  generation.connections.clear()
}

const getGeneration = (): Generation => {
  if (!current) {
    const generation: Generation = { connections: new Set(), ipc: LaunchAuthProcess.launchAuthProcess() }
    current = generation
    void generation.ipc.then(
      (ipc) => {
        const handleClose = (): void => {
          forget(generation)
          HandleIpc.unhandleIpc(ipc)
        }
        if (ipc.addEventListener) {
          ipc.addEventListener('close', handleClose, { once: true })
        } else {
          ipc.on('close', handleClose)
        }
      },
      () => forget(generation),
    )
  }
  return current
}

export const acquire = async (): Promise<{ readonly connectionId: string; readonly ipc: any }> => {
  const generation = getGeneration()
  const connectionId = randomUUID()
  generation.connections.add(connectionId)
  connections.set(connectionId, generation)
  try {
    const ipc = await generation.ipc
    if (!generation.connections.has(connectionId)) {
      throw new Error('Auth process closed while connecting')
    }
    return { connectionId, ipc }
  } catch (error) {
    release(connectionId)
    throw error
  }
}

export const release = (connectionId: string): void => {
  const generation = connections.get(connectionId)
  if (!generation) {
    return
  }
  connections.delete(connectionId)
  generation.connections.delete(connectionId)
  if (generation.connections.size > 0) {
    return
  }
  if (current === generation) {
    current = undefined
  }
  // Let the close notification's response reach the child before terminating it.
  setTimeout(() => {
    // Address the old process through its own channel. Name-based utility-process
    // disposal could kill a replacement that starts during shutdown.
    void generation.ipc.then((ipc) => JsonRpc.send(ipc, 'AuthProcess.dispose')).catch(console.error)
  }, 0)
}
