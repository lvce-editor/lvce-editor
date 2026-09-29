import { spawn } from 'node:child_process'
import { mkdir, mkdtemp, readFile as fsReadFile, readdir as fsReaddir, readlink as fsReadlink, rm, writeFile } from 'node:fs/promises'
import { createServer } from 'node:net'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const memoryFieldNames = {
  AnonHugePages: 'anonHugePagesKb',
  Anonymous: 'anonymousKb',
  Pss: 'pssKb',
  Pss_Anon: 'pssAnonKb',
  Pss_Dirty: 'pssDirtyKb',
  Pss_File: 'pssFileKb',
  Pss_Shmem: 'pssShmemKb',
  Private_Clean: 'privateCleanKb',
  Private_Dirty: 'privateDirtyKb',
  Rss: 'rssKb',
  Shared_Clean: 'sharedCleanKb',
  Shared_Dirty: 'sharedDirtyKb',
  Swap: 'swapKb',
}

const parseMemoryLine = (line) => {
  const match = /^([A-Za-z_]+):\s+(\d+)\s+kB$/.exec(line)
  if (!match) {
    return undefined
  }
  const name = memoryFieldNames[match[1]]
  if (!name) {
    return undefined
  }
  return { name, value: Number(match[2]) }
}

export const parseSmapsRollup = (text) => {
  const result = {}
  for (const line of text.split('\n')) {
    const memory = parseMemoryLine(line)
    if (memory) {
      result[memory.name] = memory.value
    }
  }
  return Object.fromEntries(Object.entries(result).sort(([a], [b]) => a.localeCompare(b)))
}

const mappingHeaderPattern = /^[0-9a-f]+-[0-9a-f]+\s+\S+\s+\S+\s+\S+\s+\S+(?:\s+(.*))?$/i

export const parseSmaps = (text) => {
  const mappings = new Map()
  let currentPath
  for (const line of text.split('\n')) {
    const header = mappingHeaderPattern.exec(line)
    if (header) {
      currentPath = header[1] || '[anonymous]'
      if (!mappings.has(currentPath)) {
        mappings.set(currentPath, {})
      }
      continue
    }
    if (!currentPath) {
      continue
    }
    const memory = parseMemoryLine(line)
    if (memory) {
      const mapping = mappings.get(currentPath)
      mapping[memory.name] = (mapping[memory.name] || 0) + memory.value
    }
  }
  return [...mappings]
    .map(([path, memory]) => {
      const result = { path, privateDirtyKb: memory.privateDirtyKb || 0 }
      for (const [name, value] of Object.entries(memory)) {
        if (name === 'privateDirtyKb') {
          continue
        }
        if (value || name === 'rssKb' || name === 'pssKb') {
          result[name] = value
        }
      }
      return result
    })
    .filter((mapping) => mapping.rssKb)
    .sort((a, b) => b.rssKb - a.rssKb || a.path.localeCompare(b.path))
}

export const parseCommandLine = (buffer) => {
  return buffer.toString('utf8').split('\0').filter(Boolean)
}

const parseLabeledNumber = (value, optionName) => {
  const separatorIndex = value.lastIndexOf(':')
  if (separatorIndex <= 0) {
    throw new Error(`${optionName} must use the format <label>:<number>`)
  }
  const label = value.slice(0, separatorIndex)
  const number = Number(value.slice(separatorIndex + 1))
  if (!Number.isSafeInteger(number) || number <= 0) {
    throw new Error(`${optionName} has an invalid number: ${value}`)
  }
  return { label, number }
}

const takeOptionValue = (argv, index, optionName) => {
  const argument = argv[index]
  const equalsIndex = argument.indexOf('=')
  if (equalsIndex !== -1) {
    return { nextIndex: index, value: argument.slice(equalsIndex + 1) }
  }
  const value = argv[index + 1]
  if (!value || value.startsWith('--')) {
    throw new Error(`${optionName} requires a value`)
  }
  return { nextIndex: index + 1, value }
}

export const parseArguments = (argv) => {
  const result = {
    cdpEndpoints: [],
    code: 'code',
    compare: false,
    gpuProcesses: [],
    help: false,
    idleMs: 5000,
    lvce: 'lvce',
    output: undefined,
    ozonePlatform: process.env.WAYLAND_DISPLAY ? 'wayland' : 'x11',
    sampleIntervalMs: 1000,
    samples: 3,
  }
  for (let index = 0; index < argv.length; index++) {
    const argument = argv[index]
    if (argument === '--compare') {
      result.compare = true
      continue
    }
    if (argument === '--help' || argument === '-h') {
      result.help = true
      continue
    }
    const option = argument.split('=', 1)[0]
    if (
      ['--gpu-process', '--cdp', '--output', '--code', '--lvce', '--idle-ms', '--samples', '--sample-interval-ms', '--ozone-platform'].includes(
        option,
      )
    ) {
      const { nextIndex, value } = takeOptionValue(argv, index, option)
      index = nextIndex
      if (option === '--gpu-process') {
        const { label, number } = parseLabeledNumber(value, option)
        result.gpuProcesses.push({ label, pid: number })
      } else if (option === '--cdp') {
        const { label, number } = parseLabeledNumber(value, option)
        result.cdpEndpoints.push({ label, port: number })
      } else if (option === '--output') {
        result.output = value
      } else if (option === '--code') {
        result.code = value
      } else if (option === '--lvce') {
        result.lvce = value
      } else if (option === '--ozone-platform') {
        if (value !== 'wayland' && value !== 'x11') {
          throw new Error('--ozone-platform must be either wayland or x11')
        }
        result.ozonePlatform = value
      } else {
        const number = Number(value)
        if (!Number.isSafeInteger(number) || number < 0 || (option === '--samples' && number < 1)) {
          throw new Error(`${option} has an invalid value: ${value}`)
        }
        const property = {
          '--idle-ms': 'idleMs',
          '--sample-interval-ms': 'sampleIntervalMs',
          '--samples': 'samples',
        }[option]
        result[property] = number
      }
      continue
    }
    throw new Error(`Unknown argument: ${argument}`)
  }
  return result
}

const formatReadWarning = (error, path) => `${error.code || error.name || 'Error'} reading ${path}: ${error.message}`

const parseFdInfo = (text) => {
  const result = {}
  for (const line of text.split('\n')) {
    const separator = line.indexOf(':')
    if (separator !== -1) {
      result[line.slice(0, separator)] = line.slice(separator + 1).trim()
    }
  }
  return result
}

const isGpuDescriptor = (target) => {
  return target.includes('/dev/dri/') || target.includes('dmabuf') || target.includes('dma_buf') || target.includes('sync_file')
}

const collectGpuDescriptors = async ({ pid, readdir, readFile, readlink, warnings }) => {
  const fdPath = `/proc/${pid}/fd`
  let descriptors
  try {
    descriptors = await readdir(fdPath)
  } catch (error) {
    warnings.push(formatReadWarning(error, fdPath))
    return []
  }
  const result = []
  for (const descriptor of descriptors) {
    const descriptorPath = `${fdPath}/${descriptor}`
    try {
      const target = await readlink(descriptorPath)
      if (!isGpuDescriptor(target)) {
        continue
      }
      let info
      const infoPath = `/proc/${pid}/fdinfo/${descriptor}`
      try {
        info = parseFdInfo(await readFile(infoPath, 'utf8'))
      } catch (error) {
        warnings.push(formatReadWarning(error, infoPath))
      }
      result.push({ fd: Number(descriptor), info, target })
    } catch (error) {
      if (error.code !== 'ENOENT') {
        warnings.push(formatReadWarning(error, descriptorPath))
      }
    }
  }
  return result.sort((a, b) => a.fd - b.fd)
}

export const collectGpuProcess = async ({ label, pid, readFile = fsReadFile, readdir = fsReaddir, readlink = fsReadlink }) => {
  const warnings = []
  const commandLinePath = `/proc/${pid}/cmdline`
  let commandLine
  try {
    commandLine = parseCommandLine(await readFile(commandLinePath))
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(`GPU process ${pid} does not exist`)
    }
    warnings.push(formatReadWarning(error, commandLinePath))
  }
  const result = { commandLine, gpuDescriptors: [], label, pid, warnings }
  for (const [name, path, parse] of [
    ['memory', `/proc/${pid}/smaps_rollup`, parseSmapsRollup],
    ['mappings', `/proc/${pid}/smaps`, parseSmaps],
  ]) {
    try {
      result[name] = parse(await readFile(path, 'utf8'))
    } catch (error) {
      warnings.push(formatReadWarning(error, path))
    }
  }
  result.gpuDescriptors = await collectGpuDescriptors({ pid, readdir, readFile, readlink, warnings })
  return result
}

class CdpClient {
  constructor(webSocket, timeoutMs) {
    this.nextId = 0
    this.pending = new Map()
    this.timeoutMs = timeoutMs
    this.webSocket = webSocket
    webSocket.addEventListener('message', (event) => {
      const message = JSON.parse(event.data)
      const pending = this.pending.get(message.id)
      if (!pending) {
        return
      }
      this.pending.delete(message.id)
      clearTimeout(pending.timeout)
      if (message.error) {
        pending.reject(new Error(`${pending.method}: ${message.error.message}`))
      } else {
        pending.resolve(message.result)
      }
    })
  }

  close() {
    this.webSocket.close()
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = ++this.nextId
      const timeout = setTimeout(() => {
        this.pending.delete(id)
        reject(new Error(`${method} timed out after ${this.timeoutMs}ms`))
      }, this.timeoutMs)
      this.pending.set(id, { method, reject, resolve, timeout })
      this.webSocket.send(JSON.stringify({ id, method, params }))
    })
  }
}

const connectWebSocket = async ({ timeoutMs = 5000, url, WebSocketClass = globalThis.WebSocket }) => {
  const webSocket = new WebSocketClass(url)
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error(`CDP WebSocket timed out after ${timeoutMs}ms`)), timeoutMs)
    webSocket.addEventListener(
      'open',
      () => {
        clearTimeout(timeout)
        resolve()
      },
      { once: true },
    )
    webSocket.addEventListener(
      'error',
      () => {
        clearTimeout(timeout)
        reject(new Error('CDP WebSocket connection failed'))
      },
      { once: true },
    )
  })
  return new CdpClient(webSocket, timeoutMs)
}

const connectCdp = async ({ port, fetch, WebSocketClass = globalThis.WebSocket, timeoutMs = 5000 }) => {
  const response = await fetch(`http://127.0.0.1:${port}/json/version`)
  if ('ok' in response && !response.ok) {
    throw new Error(`CDP endpoint returned HTTP ${response.status}`)
  }
  const version = await response.json()
  if (!version.webSocketDebuggerUrl) {
    throw new Error('CDP endpoint did not provide webSocketDebuggerUrl')
  }
  return connectWebSocket({ timeoutMs, url: version.webSocketDebuggerUrl, WebSocketClass })
}

const pickGpuAttributes = (gpu = {}) => {
  const attributes = gpu.auxAttributes || {}
  return {
    auxAttributes: {
      displayType: attributes.displayType,
      glImplementationParts: attributes.glImplementationParts,
      glRenderer: attributes.glRenderer,
      glVendor: attributes.glVendor,
      glVersion: attributes.glVersion,
      hardwareSupportsVulkan: attributes.hardwareSupportsVulkan,
      sandboxed: attributes.sandboxed,
      skiaBackendType: attributes.skiaBackendType,
    },
    devices: gpu.devices || [],
    driverBugWorkarounds: gpu.driverBugWorkarounds || [],
    featureStatus: gpu.featureStatus || {},
  }
}

export const collectCdpDiagnostics = async ({ port, fetch = globalThis.fetch, WebSocketClass = globalThis.WebSocket }) => {
  let client
  try {
    client = await connectCdp({ fetch, port, WebSocketClass })
    const [browser, systemInfo, processInfo] = await Promise.all([
      client.send('Browser.getVersion'),
      client.send('SystemInfo.getInfo'),
      client.send('SystemInfo.getProcessInfo'),
    ])
    return {
      browser,
      commandLine: systemInfo.commandLine,
      gpu: pickGpuAttributes(systemInfo.gpu),
      processes: processInfo.processInfo,
    }
  } catch (error) {
    return { error: error.message }
  } finally {
    client?.close()
  }
}

export const buildLaunchSpec = ({ executable, kind, ozonePlatform, port, tempRoot, variant = 'baseline' }) => {
  const name = kind === 'code' ? 'code' : `lvce-${variant}`
  const profileRoot = join(tempRoot, name)
  const args = [`--remote-debugging-port=${port}`, `--ozone-platform=${ozonePlatform}`, `--user-data-dir=${join(profileRoot, 'user-data')}`]
  if (kind === 'code') {
    args.push('--new-window', '--disable-extensions', `--extensions-dir=${join(profileRoot, 'extensions')}`)
  } else if (variant === 'sandbox') {
    args.push('--sandbox')
  } else if (variant === 'disable-gpu') {
    args.push('--disable-gpu')
  }
  return {
    args,
    command: executable,
    env: {
      ...process.env,
      ELECTRON_OZONE_PLATFORM_HINT: ozonePlatform,
      XDG_CACHE_HOME: join(profileRoot, 'cache'),
      XDG_CONFIG_HOME: join(profileRoot, 'config'),
      XDG_DATA_HOME: join(profileRoot, 'data'),
      XDG_STATE_HOME: join(profileRoot, 'state'),
    },
    profileRoot,
  }
}

export const runWithCleanup = async (action, cleanup) => {
  try {
    return await action()
  } finally {
    await cleanup()
  }
}

const wait = (milliseconds, signal) => {
  if (!signal) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds))
  }
  return new Promise((resolve, reject) => {
    const onAbort = () => {
      clearTimeout(timeout)
      reject(signal.reason || new Error('Operation aborted'))
    }
    const timeout = setTimeout(() => {
      signal.removeEventListener('abort', onAbort)
      resolve()
    }, milliseconds)
    signal.addEventListener('abort', onAbort, { once: true })
  })
}

const getFreePort = async () => {
  const server = createServer()
  await new Promise((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', resolve)
  })
  const address = server.address()
  await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())))
  return address.port
}

const waitForCdp = async (port, timeoutMs = 30000, signal) => {
  const start = Date.now()
  let lastError
  while (Date.now() - start < timeoutMs) {
    signal?.throwIfAborted()
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/version`, { signal })
      if (response.ok) {
        return
      }
    } catch (error) {
      signal?.throwIfAborted()
      lastError = error
    }
    await wait(250, signal)
  }
  throw new Error(`Timed out waiting for CDP port ${port}${lastError ? `: ${lastError.message}` : ''}`)
}

const getProcessInfo = async (port) => {
  const diagnostics = await collectCdpDiagnostics({ port })
  if (diagnostics.error) {
    throw new Error(`Could not inspect CDP port ${port}: ${diagnostics.error}`)
  }
  return diagnostics
}

const launchApp = async (spec, port) => {
  await mkdir(spec.profileRoot, { recursive: true })
  const child = spawn(spec.command, spec.args, { env: spec.env, stdio: 'ignore' })
  const partialRun = { child, ownedPids: [], port, profileRoot: spec.profileRoot }
  const abortController = new AbortController()
  try {
    const launchError = new Promise((_, reject) => child.once('error', reject))
    await Promise.race([waitForCdp(port, 30000, abortController.signal), launchError])
    const cdp = await getProcessInfo(port)
    const gpuProcess = cdp.processes.find((processInfo) => processInfo.type === 'GPU')
    if (!gpuProcess) {
      throw new Error(`${spec.command} did not expose a GPU process`)
    }
    return {
      ...partialRun,
      cdp,
      gpuPid: gpuProcess.id,
      ownedPids: cdp.processes.map((processInfo) => processInfo.id),
    }
  } catch (error) {
    await cleanupRun(partialRun)
    throw error
  } finally {
    abortController.abort(new Error('CDP launch wait cancelled'))
  }
}

const waitForPageTarget = async (port, timeoutMs = 10000) => {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/list`)
      if (response.ok) {
        const targets = await response.json()
        const target = targets.find((item) => item.type === 'page')
        if (target) {
          return target
        }
      }
    } catch {
      // The target list may briefly disappear while Electron creates its window.
    }
    await wait(100)
  }
  return undefined
}

const normalizeWindowBounds = async (port) => {
  const start = Date.now()
  let lastError
  while (Date.now() - start < 10000) {
    let client
    try {
      const target = await waitForPageTarget(port, 1000)
      if (!target) {
        continue
      }
      client = await connectWebSocket({ url: target.webSocketDebuggerUrl })
      const evaluation = await client.send('Runtime.evaluate', {
        expression: 'window.resizeTo(800, 1000); window.moveTo(0, 0); ({ outerHeight: window.outerHeight, outerWidth: window.outerWidth })',
        returnByValue: true,
      })
      if (evaluation.exceptionDetails) {
        throw new Error(evaluation.exceptionDetails.text || 'Runtime.evaluate failed')
      }
      const bounds = evaluation.result?.value
      if (bounds?.outerHeight === 1000 && bounds?.outerWidth === 800) {
        return undefined
      }
      lastError = new Error(`requested 800x1000, received ${bounds?.outerWidth || 'unknown'}x${bounds?.outerHeight || 'unknown'}`)
    } catch (error) {
      lastError = error
    } finally {
      client?.close()
    }
    await wait(100)
  }
  return `Could not normalize window bounds after 10 seconds${lastError ? `: ${lastError.message}` : ''}`
}

const closeCdpBrowser = async (port) => {
  let client
  try {
    client = await connectCdp({ fetch, port, timeoutMs: 2000 })
    await client.send('Browser.close')
  } catch {
    // The browser may already have exited.
  } finally {
    client?.close()
  }
}

export const isOwnedCommandLine = (commandLine, run) => {
  return commandLine.includes(run.profileRoot) || commandLine.includes(`--remote-debugging-port=${run.port}`)
}

const isOwnedProcess = async (pid, run) => {
  try {
    const commandLine = (await fsReadFile(`/proc/${pid}/cmdline`)).toString('utf8')
    return isOwnedCommandLine(commandLine, run)
  } catch {
    return false
  }
}

const discoverOwnedPids = async (run) => {
  let entries
  try {
    entries = await fsReaddir('/proc')
  } catch {
    return []
  }
  const candidates = entries.filter((entry) => /^\d+$/.test(entry)).map(Number)
  const matches = await Promise.all(candidates.map(async (pid) => ((await isOwnedProcess(pid, run)) ? pid : undefined)))
  return matches.filter((pid) => pid !== undefined)
}

const parseListeningSocketInodes = (text, port) => {
  const expectedPort = port.toString(16).toUpperCase().padStart(4, '0')
  const inodes = new Set()
  for (const line of text.split('\n')) {
    const fields = line.trim().split(/\s+/)
    if (fields.length < 10 || fields[3] !== '0A') {
      continue
    }
    const localPort = fields[1].split(':').at(-1)?.toUpperCase()
    if (localPort === expectedPort) {
      inodes.add(fields[9])
    }
  }
  return inodes
}

export const discoverPortOwnerPids = async (run, { readFile = fsReadFile, readdir = fsReaddir, readlink = fsReadlink } = {}) => {
  const socketInodes = new Set()
  for (const path of ['/proc/net/tcp', '/proc/net/tcp6']) {
    try {
      for (const inode of parseListeningSocketInodes(await readFile(path, 'utf8'), run.port)) {
        socketInodes.add(inode)
      }
    } catch {
      // Port ownership is an additional cleanup signal; command-line ownership remains available.
    }
  }
  if (!socketInodes.size) {
    return []
  }
  let entries
  try {
    entries = await readdir('/proc')
  } catch {
    return []
  }
  const owners = []
  for (const entry of entries) {
    if (!/^\d+$/.test(entry)) {
      continue
    }
    let descriptors
    try {
      descriptors = await readdir(`/proc/${entry}/fd`)
    } catch {
      continue
    }
    for (const descriptor of descriptors) {
      try {
        const target = await readlink(`/proc/${entry}/fd/${descriptor}`)
        const match = /^socket:\[(\d+)\]$/.exec(target)
        if (match && socketInodes.has(match[1])) {
          owners.push(Number(entry))
          break
        }
      } catch {
        // File descriptors can disappear while they are inspected.
      }
    }
  }
  return owners.sort((a, b) => a - b)
}

const cleanupRun = async (run) => {
  if (!run) {
    return
  }
  const portOwnerPids = await discoverPortOwnerPids(run)
  await closeCdpBrowser(run.port)
  await wait(500)
  const discoveredPids = await discoverOwnedPids(run)
  const ownedPids = new Set([...(run.ownedPids || []), ...portOwnerPids, ...discoveredPids])
  const portOwnerPidSet = new Set(portOwnerPids)
  for (const pid of ownedPids) {
    if (portOwnerPidSet.has(pid) || (await isOwnedProcess(pid, run))) {
      try {
        process.kill(pid, 'SIGTERM')
      } catch (error) {
        if (error.code !== 'ESRCH') {
          throw error
        }
      }
    }
  }
  if (run.child && run.child.exitCode === null && !run.child.killed) {
    run.child.kill('SIGTERM')
  }
}

const softwareRendererPattern = /llvmpipe|softpipe|swiftshader|software rasterizer/i

export const compareRenderers = (codeCdp, lvceCdp) => {
  const codeRenderer = codeCdp?.gpu?.auxAttributes?.glRenderer
  const lvceRenderer = lvceCdp?.gpu?.auxAttributes?.glRenderer
  const sameRenderer = Boolean(codeRenderer && lvceRenderer && codeRenderer === lvceRenderer)
  const hardwareRenderer = sameRenderer && !softwareRendererPattern.test(codeRenderer)
  return { codeRenderer, hardwareRenderer, lvceRenderer, sameRenderer }
}

const median = (values) => {
  const sorted = [...values].sort((a, b) => a - b)
  const middle = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2
}

const summarizeSamples = (samples) => {
  const fields = new Set(samples.flatMap((sample) => Object.keys(sample.memory || {})))
  return Object.fromEntries(
    [...fields]
      .sort()
      .map((field) => [field, median(samples.map((sample) => sample.memory?.[field]).filter((value) => typeof value === 'number'))])
      .filter(([, value]) => Number.isFinite(value)),
  )
}

const samplePair = async ({ codeRun, idleMs, lvceRun, sampleIntervalMs, samples }) => {
  await wait(idleMs)
  const codeSamples = []
  const lvceSamples = []
  for (let index = 0; index < samples; index++) {
    const [code, lvce] = await Promise.all([
      collectGpuProcess({ label: 'code', pid: codeRun.gpuPid }),
      collectGpuProcess({ label: 'lvce', pid: lvceRun.gpuPid }),
    ])
    codeSamples.push(code)
    lvceSamples.push(lvce)
    if (index + 1 < samples) {
      await wait(sampleIntervalMs)
    }
  }
  return {
    code: { diagnostics: codeSamples.at(-1), medianMemory: summarizeSamples(codeSamples), samples: codeSamples.map((sample) => sample.memory) },
    lvce: { diagnostics: lvceSamples.at(-1), medianMemory: summarizeSamples(lvceSamples), samples: lvceSamples.map((sample) => sample.memory) },
  }
}

export const runComparison = async ({ code, idleMs, lvce, ozonePlatform, sampleIntervalMs, samples }) => {
  if (ozonePlatform === 'wayland' && !process.env.WAYLAND_DISPLAY) {
    throw new Error('Wayland comparison requested, but WAYLAND_DISPLAY is not set')
  }
  const tempRoot = await mkdtemp(join(tmpdir(), 'lvce-gpu-comparison-'))
  let codeRun
  let lvceRun
  try {
    const codePort = await getFreePort()
    const codeSpec = buildLaunchSpec({ executable: code, kind: 'code', ozonePlatform, port: codePort, tempRoot })
    codeRun = await launchApp(codeSpec, codePort)
    const codeWindowWarning = await normalizeWindowBounds(codePort)
    const variants = []
    for (const variant of ['baseline', 'sandbox', 'disable-gpu']) {
      const port = await getFreePort()
      const spec = buildLaunchSpec({ executable: lvce, kind: 'lvce', ozonePlatform, port, tempRoot, variant })
      lvceRun = await launchApp(spec, port)
      const lvceWindowWarning = await normalizeWindowBounds(port)
      const measurements = await samplePair({ codeRun, idleMs, lvceRun, sampleIntervalMs, samples })
      variants.push({
        codeCdp: codeRun.cdp,
        codeWindowWarning,
        lvceCdp: lvceRun.cdp,
        lvceWindowWarning,
        measurements,
        variant,
      })
      await cleanupRun(lvceRun)
      lvceRun = undefined
    }
    const baseline = variants[0].measurements
    const codeRssKb = baseline.code.medianMemory.rssKb
    const lvceRssKb = baseline.lvce.medianMemory.rssKb
    const renderer = compareRenderers(variants[0].codeCdp, variants[0].lvceCdp)
    const windowsNormalized = variants.every((variant) => !variant.codeWindowWarning && !variant.lvceWindowWarning)
    return {
      acceptance: {
        codeMedianRssKb: codeRssKb,
        ...renderer,
        lvceMedianRssKb: lvceRssKb,
        windowsNormalized,
        passed: windowsNormalized && renderer.hardwareRenderer && Number.isFinite(codeRssKb) && Number.isFinite(lvceRssKb) && lvceRssKb <= codeRssKb,
        requirement: 'LVCE and Code must use normalized windows and the same hardware renderer, and LVCE median idle GPU RSS must not exceed Code',
      },
      generatedAt: new Date().toISOString(),
      ozonePlatform,
      variants,
    }
  } finally {
    await cleanupRun(lvceRun)
    await cleanupRun(codeRun)
    await rm(tempRoot, { force: true, recursive: true })
  }
}

export const collectDiagnostics = async ({ cdpEndpoints, gpuProcesses }) => {
  const cdpByLabel = new Map(cdpEndpoints.map((endpoint) => [endpoint.label, endpoint.port]))
  const processes = []
  for (const processSpec of gpuProcesses) {
    const processDiagnostics = await collectGpuProcess(processSpec)
    const port = cdpByLabel.get(processSpec.label)
    if (port) {
      processDiagnostics.cdp = await collectCdpDiagnostics({ port })
    }
    processes.push(processDiagnostics)
  }
  return { generatedAt: new Date().toISOString(), processes }
}

export const writeReport = async (report, output) => {
  const json = `${JSON.stringify(report, null, 2)}\n`
  if (output) {
    await writeFile(output, json)
    return output
  }
  process.stdout.write(json)
  return undefined
}
