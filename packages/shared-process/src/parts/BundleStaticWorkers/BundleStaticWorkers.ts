import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { rollup } from 'rollup'
import { createBundledWorkerConstructor } from '../BundledWorkerRuntime/BundledWorkerRuntime.ts'

const mainCall = /^main\(\);?$/m
const awaitedListen = /^await listen\(\);?$/m

const workerIds = ['editor', 'extensionManagementWorker', 'iconThemeWorker', 'cacheWorker', 'explorer']
const bindings = [
  'globalThis',
  'self',
  'Worker',
  'WorkerGlobalScope',
  'MessageChannel',
  'location',
  'name',
  'postMessage',
  'addEventListener',
  'removeEventListener',
  'close',
  'setTimeout',
  'clearTimeout',
  'setInterval',
  'clearInterval',
  'requestAnimationFrame',
  'cancelAnimationFrame',
  'fetch',
  'window',
  'document',
]

export const createWorkerFactory = async (input: string, publicPath: string): Promise<string> => {
  const bundle = await rollup({
    input,
    plugins: [
      {
        name: 'bundled-worker-scope',
        resolveImportMeta(property): string {
          if (property === 'url') return 'globalThis.location.href'
          throw new Error(`Unsupported worker import.meta property: ${property}`)
        },
        transform(code, id): string | null {
          if (id.replaceAll('\\', '/') === input.replaceAll('\\', '/')) {
            // Capture rejected startup rather than leaving the parent's ready wait hanging.
            if (awaitedListen.test(code)) return null
            if (!mainCall.test(code)) throw new Error(`Missing worker startup call: ${input}`)
            return code.replace(mainCall, 'const bundledStartupPromise = main();') + '\nawait bundledStartupPromise;\n'
          }
          return null
        },
      },
    ],
    preserveEntrySignatures: false,
  })
  try {
    const { output } = await bundle.generate({ format: 'es', inlineDynamicImports: true })
    const chunk = output[0]
    if (chunk.type !== 'chunk' || chunk.imports.length || chunk.exports.length) throw new Error(`Worker must be self-contained: ${input}`)
    return `[new URL(${JSON.stringify(publicPath)}, location.origin).href]: async (scope) => {\nconst { ${bindings.join(', ')} } = scope;\nawait (async () => {\n${chunk.code}\n})();\n}`
  } finally {
    await bundle.close()
  }
}

export const bundleStaticWorkers = async ({ commitHash, pathPrefix, root, workers }: any): Promise<void> => {
  const paths = [
    '/packages/renderer-worker/dist/rendererWorkerMain.js',
    ...workerIds.map((id) => {
      const worker = workers.find((item: any) => item.id === id)
      if (!worker) throw new Error(`Missing bundled worker: ${id}`)
      return worker.productionPath
    }),
  ]
  const factories: string[] = []
  for (const path of paths) {
    const publicPath = `${pathPrefix}/${commitHash}${path}`
    factories.push(await createWorkerFactory(join(root, 'dist', commitHash, path), publicPath))
  }
  const rendererDirectory = join(root, 'dist', commitHash, 'packages/renderer-process/dist')
  const renderer = await readFile(join(rendererDirectory, 'rendererProcessMain.js'), 'utf8')
  const runtime = `const Worker = (${createBundledWorkerConstructor.toString()})({${factories.join(',\n')}}, globalThis);\n`
  await writeFile(join(rendererDirectory, 'renderer-process.bundled.js'), runtime + renderer)
  const htmlPath = join(root, 'dist', 'index.html')
  const html = await readFile(htmlPath, 'utf8')
  if (!html.includes('/rendererProcessMain.js')) throw new Error('Missing renderer script in static export')
  await writeFile(htmlPath, html.replaceAll('/rendererProcessMain.js', '/renderer-process.bundled.js'))
}
