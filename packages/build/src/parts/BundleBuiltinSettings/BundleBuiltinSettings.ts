import { existsSync } from 'node:fs'
import * as JsonFile from '../JsonFile/JsonFile.ts'
import * as Path from '../Path/Path.ts'

interface SettingsContribution {
  readonly id: string
  readonly [key: string]: unknown
}

interface SettingsFile {
  readonly fileName: string
  readonly settings: readonly SettingsContribution[]
}

const rendererSettingsPath = 'packages/renderer-worker/settings.json'

const settingTypeNames: ReadonlyMap<number, string> = new Map([
  [0, 'none'],
  [1, 'enum'],
  [2, 'string'],
  [3, 'boolean'],
  [4, 'array'],
  [5, 'number'],
  [6, 'color'],
  [7, 'url'],
])

export const normalizeSettingContribution = (setting: SettingsContribution): SettingsContribution => {
  if (typeof setting.type !== 'number') {
    return setting
  }
  const type = settingTypeNames.get(setting.type)
  if (type === undefined) {
    return setting
  }
  return {
    ...setting,
    type,
  }
}

export const deduplicateSettingsContributions = (files: readonly SettingsFile[]): readonly SettingsFile[] => {
  const seenSettings = new Map<string, string>()
  const result: SettingsFile[] = []
  for (const file of files) {
    const uniqueSettings: SettingsContribution[] = []
    for (const rawSetting of file.settings) {
      const setting = normalizeSettingContribution(rawSetting)
      const serialized = JSON.stringify(setting)
      const previous = seenSettings.get(setting.id)
      if (previous === serialized) {
        continue
      }
      if (previous) {
        throw new TypeError(`Conflicting builtin setting ${setting.id}`)
      }
      seenSettings.set(setting.id, serialized)
      uniqueSettings.push(setting)
    }
    if (uniqueSettings.length > 0) {
      result.push({
        fileName: file.fileName,
        settings: uniqueSettings,
      })
    }
  }
  return result
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
  const settingsFiles: SettingsFile[] = [
    {
      fileName: 'renderer-worker.json',
      settings: await JsonFile.readJson(Path.absolute(rendererSettingsPath)),
    },
  ]
  for (const candidate of getSettingsContributionCandidates(workers)) {
    const from = getSourcePath(candidate.sourcePath)
    if (!from) {
      continue
    }
    settingsFiles.push({
      fileName: `${candidate.packageName}.json`,
      settings: await JsonFile.readJson(Path.absolute(from)),
    })
  }
  const fileNames: string[] = []
  for (const settingsFile of deduplicateSettingsContributions(settingsFiles)) {
    await JsonFile.writeJson({
      to: Path.join(toRoot, 'builtin-settings', settingsFile.fileName),
      value: settingsFile.settings,
    })
    fileNames.push(settingsFile.fileName)
  }
  await JsonFile.writeJson({
    to: Path.join(toRoot, 'builtin-settings', 'index.json'),
    value: fileNames,
  })
}
