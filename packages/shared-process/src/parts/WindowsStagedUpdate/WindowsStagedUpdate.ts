import { execFile, spawn } from 'node:child_process'
import { createHash, randomBytes } from 'node:crypto'
import { closeSync, createReadStream, createWriteStream } from 'node:fs'
import { access, copyFile, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { basename, dirname, join } from 'node:path'
import { Readable } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import { promisify } from 'node:util'
import * as CompareVersion from '../CompareVersion/CompareVersion.ts'
import * as ElectronDialog from '../ElectronDialog/ElectronDialog.ts'
import * as Exit from '../Exit/Exit.ts'
import * as Platform from '../Platform/Platform.ts'
import * as UpdateLog from '../UpdateLog/UpdateLog.ts'
import * as WindowsUpdateScripts from '../WindowsUpdateScripts/WindowsUpdateScripts.ts'

interface Plan {
  archive: string
  backup: string
  exe: string
  install: string
  log: string
  parentPid: number
  ready: string
  stage: string
  token: string
  version: string
}

let running = false
let prepared: { plan: Plan; path: string } | undefined
const RE_VERSION = /^\d+\.\d+\.\d+$/
const RE_DIGEST = /^sha256:[a-f0-9]{64}$/
const RE_TAG = /^v/
const RE_TOKEN = /^[a-f0-9]{32}$/

const powershell = (): string => join(process.env.SystemRoot || 'C:\\Windows', 'System32', 'WindowsPowerShell', 'v1.0', 'powershell.exe')
const argumentsFor = (script: string): string[] => [
  '-NoProfile',
  '-NonInteractive',
  '-EncodedCommand',
  Buffer.from(script, 'utf16le').toString('base64'),
]

export const validateAsset = (asset: { name: string; browser_download_url: string; digest: string }, version: string, arch: string): void => {
  if (!RE_VERSION.test(version) || !['x64', 'arm64'].includes(arch)) {
    throw new Error('Unsupported Windows update version or architecture')
  }
  const name = `Lvce-Update-v${version}-${arch}.zip`
  if (asset.name !== name || asset.browser_download_url !== `https://github.com/lvce-editor/lvce-editor/releases/download/v${version}/${name}`) {
    throw new Error('Unexpected Windows update asset')
  }
  if (!RE_DIGEST.test(asset.digest)) {
    throw new Error('Windows update requires a published SHA256 digest')
  }
}

export const verifyDigest = async (path: string, expected: string): Promise<void> => {
  const hash = createHash('sha256')
  for await (const chunk of createReadStream(path)) {
    hash.update(chunk)
  }
  if (`sha256:${hash.digest('hex')}` !== expected) {
    throw new Error('Windows update checksum mismatch')
  }
}

const prepare = async (asset: any, version: string): Promise<{ plan: Plan; path: string }> => {
  if (prepared?.plan.version === version) {
    return prepared
  }
  validateAsset(asset, version, process.arch)
  const install = dirname(process.execPath)
  // Sibling directories guarantee same-volume renames. Never stage inside the
  // live application: the old installer may remove that entire tree.
  const token = randomBytes(16).toString('hex')
  const stage = `${install}.stage-${token}`
  const work = `${install}.updates`
  await mkdir(work, { recursive: true })
  const path = join(work, `${token}.json`)
  const plan: Plan = {
    archive: join(work, `${token}.zip`),
    backup: `${install}.backup-${token}`,
    exe: basename(process.execPath),
    install,
    log: UpdateLog.getPath(),
    parentPid: process.ppid,
    ready: join(work, `${token}.ready`),
    stage,
    token,
    version,
  }
  await writeFile(path, JSON.stringify(plan), { flag: 'wx' })
  UpdateLog.write(`Staged update download started version=${version}`)
  const response = await fetch(asset.browser_download_url, { signal: AbortSignal.timeout(600_000) })
  if (!response.ok || !response.body) {
    throw new Error(`Update download failed: ${response.status}`)
  }
  await pipeline(Readable.fromWeb(response.body as any), createWriteStream(plan.archive, { flags: 'wx' }))
  await verifyDigest(plan.archive, asset.digest)
  UpdateLog.write(`Staged update download verified version=${version}; extraction started`)
  await promisify(execFile)(powershell(), argumentsFor(WindowsUpdateScripts.extract), {
    env: { ...process.env, LVCE_UPDATE_PLAN: path },
    timeout: 600_000,
    windowsHide: true,
  })
  const config = JSON.parse(await readFile(join(stage, 'resources', 'app', 'config.json'), 'utf8'))
  if (config.version !== version) {
    throw new Error('Extracted application version does not match release')
  }
  await access(join(stage, plan.exe))
  // Retain the registered NSIS uninstaller for normal uninstall / repair.
  // The update archive contains only application files, never user data.
  await copyFile(join(install, `Uninstall ${Platform.productNameLong}.exe`), join(stage, `Uninstall ${Platform.productNameLong}.exe`))
  await copyFile(join(install, 'uninstallerIcon.ico'), join(stage, 'uninstallerIcon.ico')).catch((error) => {
    if (error.code !== 'ENOENT') {
      throw error
    }
  })
  await writeFile(join(stage, '.lvce-update.json'), JSON.stringify({ token, version }))
  UpdateLog.write(`Staged update ready version=${version} stage=${stage}`)
  prepared = { path, plan }
  return prepared
}

const restart = async ({ path, plan }: { path: string; plan: Plan }): Promise<void> => {
  await writeFile(path, JSON.stringify({ ...plan, parentPid: process.ppid }))
  await rm(`${path}.started`, { force: true })
  await writeFile(`${path}.helper.ps1`, WindowsUpdateScripts.activate)
  const output = UpdateLog.openOutput()
  const child = spawn(powershell(), argumentsFor(WindowsUpdateScripts.activate), {
    cwd: dirname(plan.install),
    detached: true,
    env: { ...process.env, LVCE_UPDATE_PLAN: path },
    stdio: ['ignore', output, output],
    windowsHide: true,
  })
  closeSync(output)
  await new Promise<void>((resolve, reject) => {
    child.once('spawn', resolve)
    child.once('error', reject)
  })
  child.unref()
  // Do not exit if PowerShell is blocked or the helper cannot initialize.
  for (let attempt = 0; attempt < 300; attempt++) {
    if ((await readFile(`${path}.started`, 'utf8').catch(() => '')) === 'ready') {
      UpdateLog.write('Staged update helper acknowledged; exiting editor')
      await Exit.exit()
      return
    }
    if (child.exitCode !== null) {
      throw new Error(`Update helper exited before startup (${child.exitCode})`)
    }
    await new Promise((resolve) => setTimeout(resolve, 100))
  }
  child.kill()
  throw new Error('Update helper did not acknowledge startup; editor left running')
}

// Returns false only when the release predates staged-update artifacts, allowing
// the caller to retain the existing NSIS update path for those releases.
export const check = async (silent: boolean, windowId: number): Promise<boolean> => {
  if (running) {
    return true
  }
  running = true
  try {
    const response = await fetch('https://api.github.com/repos/lvce-editor/lvce-editor/releases/latest', { signal: AbortSignal.timeout(30_000) })
    if (!response.ok) {
      throw new Error(`Release check failed: ${response.status}`)
    }
    const release: any = await response.json()
    const version = release.tag_name.replace(RE_TAG, '')
    if (!CompareVersion.isGreater(version, Platform.version)) {
      if (!silent) {
        await ElectronDialog.showMessageBox({ buttons: ['OK'], message: 'No update available.', type: 'info', windowId })
      }
      return true
    }
    const asset = release.assets.find((item: any) => item.name === `Lvce-Update-v${version}-${process.arch}.zip`)
    if (!asset) {
      return false
    }
    if (!silent) {
      const answer = await ElectronDialog.showMessageBox({
        buttons: ['Prepare Update', 'Cancel'],
        defaultId: 0,
        message: `Download and prepare update ${version}?`,
        type: 'question',
        windowId,
      })
      if (answer !== 0) {
        return true
      }
    }
    const update = await prepare(asset, version)
    const answer = await ElectronDialog.showMessageBox({
      buttons: ['Restart', 'Later'],
      defaultId: 0,
      message: `Update ${version} is ready. Restart now?`,
      type: 'question',
      windowId,
    })
    if (answer === 0) {
      await restart(update)
    }
    return true
  } catch (error) {
    UpdateLog.writeSafe(`Staged update failed: ${error.stack || error.message}`)
    throw error
  } finally {
    running = false
  }
}

export const confirmStartup = async (): Promise<void> => {
  if (!Platform.isWindows || !Platform.isProduction) {
    return
  }
  const install = dirname(process.execPath)
  const marker = await readFile(join(install, '.lvce-update.json'), 'utf8').catch(() => '')
  if (!marker) {
    return
  }
  const { token, version } = JSON.parse(marker)
  if (!RE_TOKEN.test(token) || version !== Platform.version) {
    throw new Error('Invalid staged update startup marker')
  }
  await writeFile(join(`${install}.updates`, `${token}.ready`), token)
  UpdateLog.write(`Staged update startup confirmed version=${version}`)
}
