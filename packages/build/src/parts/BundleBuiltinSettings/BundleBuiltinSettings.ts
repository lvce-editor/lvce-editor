import { existsSync } from 'node:fs'
import * as Copy from '../Copy/Copy.ts'
import * as JsonFile from '../JsonFile/JsonFile.ts'
import * as Path from '../Path/Path.ts'

const SettingTypeString = 2
const SettingTypeBoolean = 3
const SettingTypeArray = 4
const SettingTypeNumber = 5

interface SettingsContribution {
  readonly id: string
  readonly type: number
  readonly value: unknown
}

const getSettingType = (value: unknown): number => {
  if (typeof value === 'string') {
    return SettingTypeString
  }
  if (typeof value === 'boolean') {
    return SettingTypeBoolean
  }
  if (typeof value === 'number') {
    return SettingTypeNumber
  }
  if (value && typeof value === 'object') {
    return SettingTypeArray
  }
  throw new TypeError(`Unsupported default setting value: ${value}`)
}

export const createSettingsContribution = (defaultSettings: Readonly<Record<string, unknown>>): readonly SettingsContribution[] => {
  return Object.entries(defaultSettings).map(([id, value]) => ({
    id,
    type: getSettingType(value),
    value,
  }))
}

export const createWorkerPathSettingsContribution = (workers: readonly any[]): readonly SettingsContribution[] => {
  const settingNames = new Set<string>()
  for (const worker of workers) {
    if (worker.settingName) {
      settingNames.add(worker.settingName)
    }
  }
  return [...settingNames].sort().map((id) => ({
    id,
    type: SettingTypeString,
    value: '',
  }))
}

const stripLeadingSlash = (path: string): string => {
  return path.replaceAll('\\', '/').replace(/^\/+/, '')
}

const getSettingsPath = (defaultPath: string): string => {
  const normalizedPath = stripLeadingSlash(defaultPath)
  const lastSlashIndex = normalizedPath.lastIndexOf('/')
  return `${normalizedPath.slice(0, lastSlashIndex)}/settings.json`
}

const getSourcePath = (path: string): string => {
  const sourcePath = stripLeadingSlash(path)
  if (existsSync(Path.absolute(sourcePath))) {
    return sourcePath
  }
  const hoistedPath = sourcePath.replace(/^packages\/renderer-worker\/node_modules\//, 'node_modules/')
  if (existsSync(Path.absolute(hoistedPath))) {
    return hoistedPath
  }
  return ''
}

const getPackageName = (productionPath: string): string => {
  const match = stripLeadingSlash(productionPath).match(/^packages\/([^/]+)\//)
  return match?.[1] || ''
}

export const getSettingsContributionCandidates = (workers: readonly any[]): readonly any[] => {
  const candidates = new Map<string, string>()
  for (const worker of workers) {
    const { defaultPath, productionPath } = worker
    if (!defaultPath || !productionPath) {
      continue
    }
    const packageName = getPackageName(productionPath)
    if (!packageName || candidates.has(packageName)) {
      continue
    }
    const settingsPath = getSettingsPath(defaultPath)
    candidates.set(packageName, settingsPath)
  }
  return [...candidates].sort(([a], [b]) => a.localeCompare(b)).map(([packageName, sourcePath]) => ({ packageName, sourcePath }))
}

export const bundleBuiltinSettings = async ({ workers, toRoot }): Promise<void> => {
  const fileNames: string[] = []
  for (const candidate of getSettingsContributionCandidates(workers)) {
    const from = getSourcePath(candidate.sourcePath)
    if (!from) {
      continue
    }
    const fileName = `${candidate.packageName}.json`
    await Copy.copyFile({
      from,
      to: Path.join(toRoot, 'builtin-settings', fileName),
    })
    fileNames.push(fileName)
  }
  const defaultSettings = await JsonFile.readJson(Path.absolute('static/config/defaultSettings.json'))
  const coreFileName = 'renderer-worker.json'
  await JsonFile.writeJson({
    to: Path.join(toRoot, 'builtin-settings', coreFileName),
    value: [...createWorkerPathSettingsContribution(workers), ...createSettingsContribution(defaultSettings)],
  })
  fileNames.push(coreFileName)
  await JsonFile.writeJson({
    to: Path.join(toRoot, 'builtin-settings', 'index.json'),
    value: fileNames,
  })
}
