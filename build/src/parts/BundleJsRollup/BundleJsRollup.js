import { basename, join } from 'node:path'
import * as rollup from 'rollup'

/**
 *
 * @param {{from:string,cwd:string, exclude?:string[], platform:'node'|'webworker'|'web'|'node/cjs', minify?:boolean, codeSplitting?:boolean }} param0
 */
export const bundleJs = async ({
  cwd,
  from,
  platform,
  exclude,
  minify = false,
  codeSplitting = false,
}) => {
  /**
   * @type {import('rollup').RollupOptions}
   */
  const inputOptions = {
    cache: false,
    input: join(cwd, from),
    preserveEntrySignatures: 'strict',
    treeshake: {
      propertyReadSideEffects: false,
      // moduleSideEffects: false,
    },
    perf: true,
  }
  const result = await rollup.rollup(inputOptions)
  if (result.getTimings) {
    const timings = result.getTimings()
    console.log({ timings })
  }
  /**
   * @type {import('rollup').OutputOptions}
   */
  const outputOptions = {
    paths: {},
    sourcemap: true,
    format: 'es',
    name: 'rendererProcess',
    extend: false,
    dir: codeSplitting ? join(cwd, 'dist') : undefined,
    file: codeSplitting ? undefined : join(cwd, 'dist', basename(from)),
    entryFileNames: 'renderer-process.modern.js',
    exports: 'auto',
    chunkFileNames(x) {
      return `${x.name}.js`
    },
    freeze: false,
    inlineDynamicImports: !codeSplitting,
  }
  await result.write(outputOptions)
}
