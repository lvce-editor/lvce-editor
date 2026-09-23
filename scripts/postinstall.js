import { access, cp, mkdir, readFile, rm, symlink } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

const workspaceDirectories = [
  'packages/build',
  'packages/extension-host-worker-tests',
  'packages/main-process',
  'packages/renderer-worker',
  'packages/server',
  'packages/shared-process',
  'packages/static-server',
]

const ensureLink = async (target, source) => {
  try {
    await access(target)
  } catch {
    await symlink(source, target, 'junction')
  }
}

const getWorkspaceDependencyNames = async (workspaceDirectory) => {
  const packageJson = JSON.parse(await readFile(join(root, workspaceDirectory, 'package.json'), 'utf8'))
  return Object.keys({
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
    ...packageJson.optionalDependencies,
    ...packageJson.peerDependencies,
  }).filter((name) => name.startsWith('@lvce-editor/') || name.startsWith('@vscode/'))
}

const createWorkspaceCompatibilityLinks = async () => {
  for (const workspaceDirectory of workspaceDirectories) {
    const workspaceNodeModules = join(root, workspaceDirectory, 'node_modules')
    await mkdir(workspaceNodeModules, { recursive: true })
    const dependencyNames = await getWorkspaceDependencyNames(workspaceDirectory)
    for (const dependencyName of dependencyNames) {
      const target = join(workspaceNodeModules, dependencyName)
      const source = join(root, 'node_modules', dependencyName)
      await mkdir(dirname(target), { recursive: true })
      await ensureLink(target, source)
    }
  }
  const electronTarget = join(root, 'packages/main-process/node_modules/electron')
  const electronSource = join(root, 'node_modules/electron')
  await ensureLink(electronTarget, electronSource)
}

const main = async () => {
  await createWorkspaceCompatibilityLinks()
  await import('./use-sample-data.js')
  if (process.env.DOWNLOAD_BUILTIN_EXTENSIONS !== '0') {
    await import('../packages/build/src/parts/DownloadBuiltinExtensions/DownloadBuiltinExtensions.ts')
  }
}

main()
