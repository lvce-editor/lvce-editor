import { build } from 'esbuild'
import { glob } from 'glob'
import * as Path from '../Path/Path.ts'

export const minifyWorkerBundles = async (toRoot: string): Promise<void> => {
  const root = Path.absolute(toRoot)
  const entries = await glob('packages/*/dist/*WorkerMain.js', { cwd: root, absolute: true, nodir: true })
  if (entries.length === 0) {
    throw new Error(`No worker bundles found in ${root}`)
  }
  const bundlesToMinify = entries.filter((entry) => !/(?:^|[\\/])editor-worker[\\/]/.test(entry))
  if (bundlesToMinify.length === 0) {
    return
  }
  await build({
    entryPoints: bundlesToMinify.sort(),
    outbase: root,
    outdir: root,
    allowOverwrite: true,
    format: 'esm',
    minify: true,
    keepNames: true,
  })
}
