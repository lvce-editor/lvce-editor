import { basename, join } from 'node:path'
import * as rollup from 'rollup'
import * as ExitCode from '../ExitCode/ExitCode.js'
import * as Process from '../Process/Process.js'

const getExternal = (babelExternal, initialExternal) => {
  const external = [...initialExternal]
  if (babelExternal) {
    external.push(/babel-parser\.js$/)
  }
  return external
}

/**
 *
 * @param {{from:string,cwd:string, exclude?:string[], platform:'node'|'webworker'|'web'|'node/cjs', minify?:boolean, codeSplitting?:boolean, babelExternal?:boolean
 * allowCyclicDependencies?:boolean, external?:string[], manualChunks:import('rollup').ManualChunksOption }} param0
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
  external = [],
  manualChunks = {},
}) => {
  const allExternal = getExternal(babelExternal, external)
  const plugins = []
  if (platform === 'node/cjs') {
    const { default: commonjs } = await import('@rollup/plugin-commonjs')
    const { nodeResolve } = await import('@rollup/plugin-node-resolve')
    // @ts-ignore
    plugins.push(commonjs(), nodeResolve())
  }
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
          console.warn(`RollUp: ${message.message}`)
        } else {
          console.error(`RollupError: Cyclic dependency detected`)
          console.error(message.message)
          Process.exit(ExitCode.Error)
        }
      } else {
        console.error(`RollUp: ${message.message} ${message.id || ''}`)
      }
    },
    external: allExternal,
    plugins,
  }
  const result = await rollup.rollup(inputOptions)
  if (result.getTimings) {
    const timings = result.getTimings()
    console.log({ timings })
  }
  /**
   * @type {import('rollup').ModuleFormat}
   */
  let outputFormat = 'es'
  if (platform === 'node/cjs') {
    outputFormat = 'commonjs'
  }
  /**
   * @type {import('rollup').OutputOptions}
   */
  const outputOptions = {
    paths: {},
    manualChunks,
    sourcemap: true,
    format: outputFormat,
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
