import { existsSync } from 'node:fs'
import * as Copy from '../Copy/Copy.ts'
import * as JsonFile from '../JsonFile/JsonFile.ts'
import * as Path from '../Path/Path.ts'

const stripLeadingSlash = (path: string): string => {
  return path.startsWith('/') ? path.slice(1) : path
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
    const settingsPath = stripLeadingSlash(Path.join(Path.dirname(defaultPath), 'settings.json'))
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
  await JsonFile.writeJson({
    to: Path.join(toRoot, 'builtin-settings', 'index.json'),
    value: fileNames,
  })
}
