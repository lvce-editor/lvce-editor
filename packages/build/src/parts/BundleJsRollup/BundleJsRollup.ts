import { basename, join } from 'node:path'
import { readFileSync } from 'node:fs'
import * as rollup from 'rollup'
import * as ExitCode from '../ExitCode/ExitCode.ts'
import * as Process from '../Process/Process.ts'
import { VError } from '@lvce-editor/verror'

type BundleOptions = {
  readonly allowCyclicDependencies?: boolean
  readonly babelExternal?: boolean
  readonly codeSplitting?: boolean
  readonly cwd: string
  readonly exclude?: string[]
  readonly external?: Array<string | RegExp>
  readonly from: string
  readonly minify?: boolean
  readonly modulePaths?: string[]
  readonly platform: 'node' | 'webworker' | 'web' | 'node/cjs'
  readonly sourceMap?: boolean
  readonly typescript?: boolean
}

const jsonPlugin: rollup.Plugin = {
  name: 'json',
  load(id) {
    if (!id.endsWith('.json')) {
      return null
    }
    const content = readFileSync(id, 'utf8')
    const parsed = JSON.parse(content)
    return {
      code: `export default ${JSON.stringify(parsed)}`,
      map: null,
    }
  },
}

const getExternal = (babelExternal: boolean, initialExternal: Array<string | RegExp>) => {
  const external = [...initialExternal]
  if (babelExternal) {
    external.push(/babel-parser\.js$/)
  }
  return external
}

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
  modulePaths = [],
  typescript = from.endsWith('.ts'),
  sourceMap = true,
}: BundleOptions) => {
  try {
    const allExternal = getExternal(babelExternal, external)
    const plugins: rollup.Plugin[] = [jsonPlugin]
    if (platform === 'node/cjs' || platform === 'node' || modulePaths.length > 0) {
      const { nodeResolve } = await import('@rollup/plugin-node-resolve')
      if (platform === 'node/cjs' || platform === 'node') {
        const { default: commonjs } = await import('@rollup/plugin-commonjs')
        // @ts-ignore
        plugins.push(commonjs())
      }
      plugins.push(
        nodeResolve({
          browser: platform === 'web' || platform === 'webworker',
          modulePaths,
          preferBuiltins: platform === 'node/cjs' || platform === 'node',
        }),
      )
    }
    if (typescript) {
      const { babel } = await import('@rollup/plugin-babel')
      const { default: pluginTypeScript } = await import('@babel/preset-typescript')
      plugins.push(
        babel({
          babelHelpers: 'bundled',
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
          presets: [pluginTypeScript],
        }),
      )
    }
    const inputOptions: rollup.RollupOptions = {
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
          if (message.ids && message.ids[0].includes('node_modules')) {
            return
          }
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
    let outputFormat: rollup.ModuleFormat = 'es'
    if (platform === 'node/cjs') {
      outputFormat = 'commonjs'
    }
    const outputOptions: rollup.OutputOptions = {
      paths: {},
      sourcemap: sourceMap,
      format: outputFormat,
      name: 'rendererProcess',
      extend: false,
      dir: codeSplitting ? join(cwd, 'dist') : undefined,
      file: codeSplitting ? undefined : join(cwd, 'dist', basename(from).replace('.ts', '.js')),
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
  } catch (error) {
    throw new VError(error, `Failed to bundle js`)
  }
}
