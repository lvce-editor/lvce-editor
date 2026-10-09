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

const getHtmlIndentation = (content: string, index: number): string => {
  const lineStart = content.lastIndexOf('\n', index - 1) + 1
  const indentation = content.slice(lineStart, index)
  return /^\s*$/.test(indentation) ? indentation : ''
}

const serializeConfig = (config: object, indentation: string): string => {
  const json = JSON.stringify(config, null, 2).replaceAll('<', '\\u003c').replaceAll('>', '\\u003e').replaceAll('&', '\\u0026')
  const contentIndentation = `${indentation}  `
  return json.replaceAll('\n', `\n${contentIndentation}`).replace(/^/, contentIndentation)
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
  const indentation = configElement ? getHtmlIndentation(content, configElement.index!) : '    '
  const script = configElement
    ? `<script id="Config" type="application/json">\n${serializeConfig(config, indentation)}\n${indentation}</script>`
    : `    <script id="Config" type="application/json">\n${serializeConfig(config, indentation)}\n    </script>`
  const newContent = configElement ? content.replace(configElement[0], script) : content.replace('</head>', `${script}\n  </head>`)
  if (newContent === content && !configElement) {
    throw new Error(`Could not add runtime configuration to ${path}`)
  }
  await writeFile(path, newContent)
}
