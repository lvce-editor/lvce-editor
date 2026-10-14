import { build } from 'esbuild'
import { readFile, writeFile } from 'node:fs/promises'
import { join, relative, resolve, sep } from 'node:path'

export const bundleSharedProcessGraph = async (sharedProcessPath: string) => {
  const cwd = resolve(sharedProcessPath)
  const entry = join(cwd, 'src', 'sharedProcessMain.js')
  const outdir = join(cwd, 'dist-startup')
  const result = await build({
    absWorkingDir: cwd,
    entryPoints: [entry],
    outdir,
    entryNames: '[name]',
    chunkNames: '[name]-[hash]',
    bundle: true,
    splitting: true,
    platform: 'node',
    format: 'esm',
    target: 'esnext',
    packages: 'external',
    minify: false,
    keepNames: true,
    treeShaking: false,
    plugins: [
      {
        name: 'preserve-original-module-url',
        setup(api) {
          api.onLoad({ filter: /\.js$/ }, async ({ path }) => {
            let contents = await readFile(path, 'utf8')
            if (contents.includes('import.meta.url')) {
              if (path !== join(cwd, 'src', 'parts', 'Root', 'Root.js')) {
                throw new Error(`Unreviewed import.meta.url in ${path}`)
              }
              // Keep Root's original source location while all generated chunks
              // reside in the same directory. Its root calculation stays intact.
              const originalRelative = relative(outdir, path).split(sep).join('/')
              contents = contents.replaceAll('import.meta.url', `new URL(${JSON.stringify(originalRelative)}, import.meta.url).href`)
            }
            return { contents, loader: 'js' }
          })
        },
      },
    ],
  })
  if (result.warnings.length) {
    throw new Error(`Unreviewed shared-process bundler warnings: ${JSON.stringify(result.warnings)}`)
  }
  // Preserve the main process launch path. Every local static/dynamic import in
  // the generated graph uses the same chunks, retaining module singleton state.
  await writeFile(entry, "import '../dist-startup/sharedProcessMain.js'\n")
}
