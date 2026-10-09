import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { setTimeout as delay } from 'node:timers/promises'

const electron = process.env.LVCE_ELECTRON_PATH
assert.ok(electron, 'Set LVCE_ELECTRON_PATH to the packaged Electron executable')
const directory = await mkdtemp(join(tmpdir(), 'lvce-packaged-font-'))
let child
let socket
let output = ''
const pending = new Map()
let sequence = 0
const send = (method, params = {}) =>
  new Promise((resolve, reject) => {
    const id = ++sequence
    const timer = setTimeout(() => {
      pending.delete(id)
      reject(new Error(`CDP command timed out: ${method}`))
    }, 15_000)
    pending.set(id, {
      resolve: (value) => {
        clearTimeout(timer)
        resolve(value)
      },
      reject: (error) => {
        clearTimeout(timer)
        reject(error)
      },
    })
    socket.send(JSON.stringify({ id, method, params }))
  })
const evaluate = async (expression) => {
  const result = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })
  assert.equal(result.exceptionDetails, undefined, JSON.stringify(result.exceptionDetails))
  return result.result.value
}
try {
  const project = join(directory, 'project')
  await mkdir(project)
  await writeFile(join(project, 'native-font.txt'), 'Native bundled font acceptance')
  const env = { ...process.env }
  for (const key of ['ELECTRON_RUN_AS_NODE', 'LVCE_ROOT', 'LVCE_SHARED_PROCESS_PATH', 'DEV']) delete env[key]
  for (const key of ['CONFIG', 'DATA', 'CACHE', 'STATE']) env[`XDG_${key}_HOME`] = join(directory, key.toLowerCase())
  child = spawn(
    electron,
    [
      '--no-sandbox',
      '--disable-gpu',
      '--password-store=basic',
      '--remote-debugging-port=0',
      `--user-data-dir=${directory}/chromium`,
      join(project, 'native-font.txt'),
    ],
    { env, detached: true },
  )
  child.on('error', (error) => {
    output += String(error)
  })
  for (const stream of [child.stdout, child.stderr])
    stream.on('data', (data) => {
      output += data.toString()
    })
  const deadline = Date.now() + 45_000
  let target
  while (Date.now() < deadline) {
    assert.equal(child.exitCode, null, output)
    const port = output.match(/DevTools listening on ws:\/\/127\.0\.0\.1:(\d+)\//)?.[1]
    if (port) {
      const targets = await fetch(`http://127.0.0.1:${port}/json/list`).then((response) => response.json())
      target = targets.find((item) => item.type === 'page' && item.url.startsWith('lvce-oss://-/'))
      if (target) break
    }
    await delay(100)
  }
  assert.ok(target, output)
  socket = new WebSocket(target.webSocketDebuggerUrl)
  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true })
    socket.addEventListener('error', reject, { once: true })
  })
  const fontResponses = []
  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data)
    if (message.id) {
      const request = pending.get(message.id)
      pending.delete(message.id)
      if (message.error) request?.reject(new Error(JSON.stringify(message.error)))
      else request?.resolve(message.result)
    } else if (message.method === 'Network.responseReceived' && message.params.response.url.startsWith('lvce-oss-font:')) {
      fontResponses.push(message.params.response)
    }
  })
  await send('Network.enable')
  while (Date.now() < deadline) {
    if (
      await evaluate(`Boolean(document.querySelector('.Editor') && Array.from(document.styleSheets).some(sheet => {
      try { return Array.from(sheet.cssRules).some(rule => rule.cssText.includes('lvce-oss-font://-/fonts/FiraCode-VariableFont.ttf')) } catch { return false }
    }))`)
    )
      break
    await delay(100)
  }
  assert.equal(await evaluate(`Boolean(document.querySelector('.Editor'))`), true, 'Packaged editor and renderer worker must start')
  assert.equal(
    await evaluate(`Array.from(document.styleSheets).some(sheet => {
    try { return Array.from(sheet.cssRules).some(rule => rule.cssText.includes('lvce-oss-font://-/fonts/FiraCode-VariableFont.ttf')) } catch { return false }
  })`),
    true,
    'Packaged CSS must reference the native directory source directly',
  )
  assert.equal(await evaluate('crossOriginIsolated'), true)
  const fonts = await evaluate(`document.fonts.load('14px "Fira Code"', 'font acceptance').then(fonts => fonts.map(font => font.status))`)
  assert.ok(fonts.length > 0 && fonts.every((status) => status === 'loaded'), 'Packaged CSS must load its declared native font')
  const loaded = await evaluate(
    `new FontFace('NativeAcceptance', 'url(lvce-oss-font://-/fonts/FiraCode-VariableFont.ttf?acceptance)').load().then(font => font.status)`,
  )
  assert.equal(loaded, 'loaded')
  assert.ok(
    fontResponses.some((response) => response.url.endsWith('?acceptance') && response.status === 200 && response.mimeType === 'font/ttf'),
    'Native directory source must return the font with the correct MIME type',
  )
  assert.equal(await evaluate(`fetch('/missing-native-font.ttf').then(response => response.status)`), 404)
  assert.equal(await evaluate('crossOriginIsolated'), true)
  console.log('Packaged editor startup, native CSS font loading, MIME, isolation, and missing-resource acceptance passed.')
} finally {
  socket?.close()
  for (const { reject } of pending.values()) reject(new Error('Packaged font test ended'))
  if (child?.pid) {
    const closed = child.exitCode === null ? new Promise((resolve) => child.once('close', resolve)) : Promise.resolve()
    try {
      process.kill(-child.pid, 'SIGKILL')
    } catch (error) {
      if (error.code !== 'ESRCH') throw error
    }
    await closed
  }
  await rm(directory, { recursive: true, force: true })
}
