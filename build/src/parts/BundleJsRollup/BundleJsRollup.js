import { basename, join } from 'node:path'
import * as rollup from 'rollup'
import * as ExitCode from '../ExitCode/ExitCode.js'
import * as Process from '../Process/Process.js'

const getExternal = (babelExternal) => {
  const external = []
  if (babelExternal) {
    external.push(/babel-parser\.js$/)
  }
  return external
}

/**
 *
 * @param {{from:string,cwd:string, exclude?:string[], platform:'node'|'webworker'|'web'|'node/cjs', minify?:boolean, codeSplitting?:boolean, babelExternal?:boolean
 * allowCyclicDependencies?:boolean }} param0
 */
export const bundleJs = async ({
  cwd,
  from,
  platform,
  exclude,
  minify = false,
  codeSplitting = false,
  allowCyclicDependencies = false,
  babelExternal = false,
}) => {
  const external = getExternal(babelExternal)
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
    onwarn: (message) => {
      // fail build if circular dependencies are found
      if (message.code === 'CIRCULAR_DEPENDENCY') {
        if (allowCyclicDependencies) {
          console.warn(message.message)
        } else {
          console.error(`RollupError: Cyclic dependency detected`)
          console.error(message.message)
          Process.exit(ExitCode.Error)
        }
      } else {
        console.error(message.message)
      }
    },
    external,
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
    sourcemapExcludeSources: true,
    chunkFileNames(x) {
      return `${x.name}.js`
    },
    freeze: false,
    inlineDynamicImports: !codeSplitting,
    minifyInternalExports: false,
    generatedCode: {
      constBindings: true,
      objectShorthand: true,
    },
    hoistTransitiveImports: false,
  }
  await result.write(outputOptions)
}
