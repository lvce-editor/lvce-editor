import { readFile, writeFile } from 'node:fs/promises'
import * as JsonFile from '../JsonFile/JsonFile.ts'

const workersJsonPath = 'packages/renderer-worker/src/parts/Workers/Workers.json'

const getWorkerUrls = async (assetDir: string): Promise<Record<string, string>> => {
  const workers = await JsonFile.readJson(workersJsonPath)
  const workerUrls: Record<string, string> = {}
  for (const worker of workers) {
    if (worker.settingName && worker.productionPath) {
      workerUrls[worker.settingName] = `${assetDir}${worker.productionPath}`
    }
  }
  return workerUrls
}

const getRuntimeConfig = async ({ platform, assetDir }) => {
  const workerUrls = await getWorkerUrls(assetDir)
  return {
    assetDir,
    platform,
    rendererWorkerUrl: `${assetDir}/packages/renderer-worker/dist/rendererWorkerMain.js`,
    workerUrls,
  }
}

const serializeConfig = (config: object): string => {
  return JSON.stringify(config).replaceAll('<', '\\u003c').replaceAll('>', '\\u003e').replaceAll('&', '\\u0026')
}

export const addRuntimeConfigToIndexHtml = async ({ path, platform, assetDir }) => {
  const content = await readFile(path, 'utf8')
  const configElement = content.match(/<script id="Config" type="application\/json">([\s\S]*?)<\/script>/)
  const existingConfig = configElement?.[1] ? JSON.parse(configElement[1]) : {}
  const runtimeConfig = await getRuntimeConfig({ platform, assetDir })
  const config = {
    ...existingConfig,
    ...runtimeConfig,
    workerUrls: {
      ...runtimeConfig.workerUrls,
      ...existingConfig.workerUrls,
    },
  }
  const script = `<script id="Config" type="application/json">${serializeConfig(config)}</script>`
  const newContent = configElement ? content.replace(configElement[0], script) : content.replace('</head>', `    ${script}\n  </head>`)
  if (newContent === content && !configElement) {
    throw new Error(`Could not add runtime configuration to ${path}`)
  }
  await writeFile(path, newContent)
}
