import { writeFile } from 'fs/promises'
import got from 'got'
import { tmpdir } from 'os'
import { join } from 'path'
import { WebSocket } from 'ws'
import * as DevtoolsProtocolRpc from '../DevtoolsProtocolRpc/DevtoolsProtocolRpc.js'

const createConnection = (webSocketDebuggerUrl) => {
  const webSocket = new WebSocket(webSocketDebuggerUrl)
  // console.log({ webSocket })
  return {
    on(event, listener) {
      if (event === 'message') {
        const wrappedListener = (string) => {
          listener(JSON.parse(string))
        }
        webSocket.on(event, wrappedListener)
      } else {
        webSocket.on(event, listener)
      }
    },
    send(message) {
      webSocket.send(JSON.stringify(message))
    },
  }
}

export const createCpuProfile = async (pid) => {
  // AttachDebugger.attachDebugger(pid)
  const response = await got('http://localhost:9229/json/list').json()
  const first = response[0]
  const webSocketDebuggerUrl = first.webSocketDebuggerUrl
  const ipc = createConnection(webSocketDebuggerUrl)

  await new Promise((r) => {
    ipc.on('open', r)
  })
  const rpc = DevtoolsProtocolRpc.create(ipc)
  const result = await rpc.invoke('Debugger.enable')
  const debuggerId = result.result.debuggerId
  console.log({ debuggerId })
  const p = await rpc.invoke('Profiler.enable')
  await rpc.invoke('Profiler.start')
  await new Promise((r) => {
    setTimeout(r, 10000)
  })
  const profileResult = await rpc.invoke('Profiler.stop')
  console.log({ profileResult })
  const profile = profileResult.result.profile
  const profilePath = join(tmpdir(), 'node-profile.cpuprofile')
  const profileString = JSON.stringify(profile)
  await writeFile(profilePath, profileString)
  console.log('finished')
  // const value = await rpc.invoke('Runtime.evaluate', {
  //   expression: '1+1',
  // })
  // await rpc.invoke('Debugger.pause')
  // console.log({ value })
}
