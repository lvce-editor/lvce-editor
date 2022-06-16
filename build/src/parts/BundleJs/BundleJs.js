import esbuild from 'esbuild'
import VError from 'verror'

const getEsBuildPlatform = (platform) => {
  switch (platform) {
    case 'node':
    case 'node/cjs':
      return 'node'
    case 'webworker':
    case 'web':
      return 'browser'
    default:
      throw new Error(`unknown platform "${platform}"`)
  }
}

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
  const esbuildPlatform = getEsBuildPlatform(platform)
  try {
    await esbuild.build({
      entryPoints: [from],
      bundle: true,
      outdir: 'dist',
      target: 'esnext',
      platform: esbuildPlatform,
      absWorkingDir: cwd,
      external: exclude,
      format: platform === 'node/cjs' ? 'cjs' : 'esm',
      sourcemap: true,
      minify,
      splitting: codeSplitting,
      // Code splitting not really possible in nodejs due to esbuild Error: Dynamic require of "assert" is not supported
      // see https://github.com/evanw/esbuild/issues/700
      // splitting: platform === 'node/cjs' ? false : true,
    })
  } catch (error) {
    throw new VError(error, `Failed to bundle JS for ${from}`)
  }
}
