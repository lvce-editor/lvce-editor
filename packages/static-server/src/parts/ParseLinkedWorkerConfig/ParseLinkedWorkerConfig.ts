import { resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const workerPathKeys = [
  {
    segment: '/editor-worker/',
    key: 'editorWorkerUrl',
  },
  {
    segment: '/extension-host-worker/',
    key: 'extensionHostWorkerUrl',
  },
  {
    segment: '/renderer-worker/',
    key: 'rendererWorkerUrl',
  },
  {
    segment: '/syntax-highlighting-worker/',
    key: 'syntaxHighlightingWorkerUrl',
  },
  {
    segment: '/test-worker/',
    key: 'testWorkerUrl',
  },
]

const getRemoteUrl = (path: string) => {
  const url = pathToFileURL(path).toString().slice('file:///'.length)
  return `/remote/${url}`
}

const getAbsolutePath = (path: string, cwd: string) => {
  if (path.startsWith('file://')) {
    return fileURLToPath(path)
  }
  return resolve(cwd, path)
}

const normalizePath = (path: string) => {
  return path.replaceAll('\\', '/')
}

const getWorkerKey = (path: string) => {
  const normalizedPath = normalizePath(path)
  const workerPathKey = workerPathKeys.find((item) => normalizedPath.includes(item.segment))
  return workerPathKey?.key || ''
}

const getLinkPath = (argv: readonly string[], index: number) => {
  const arg = argv[index]
  if (arg.startsWith('--link=')) {
    return arg.slice('--link='.length)
  }
  if (arg === '--link') {
    return argv[index + 1] || ''
  }
  return ''
}

export const getNormalizedArgv = (argv: readonly string[], cwd = process.cwd()) => {
  const normalizedArgv: string[] = []
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg.startsWith('--link=')) {
      const linkPath = arg.slice('--link='.length)
      const absolutePath = getAbsolutePath(linkPath, cwd)
      normalizedArgv.push(`--link=${pathToFileURL(absolutePath).toString()}`)
      continue
    }
    if (arg === '--link') {
      const linkPath = argv[i + 1]
      normalizedArgv.push(arg)
      if (linkPath) {
        const absolutePath = getAbsolutePath(linkPath, cwd)
        normalizedArgv.push(pathToFileURL(absolutePath).toString())
        i++
      }
      continue
    }
    normalizedArgv.push(arg)
  }
  return normalizedArgv
}

export const parseLinkedWorkerConfig = (argv: readonly string[], cwd = process.cwd()) => {
  const config: { argv: string[]; linkedWorkers: Record<string, string>; [key: string]: string | string[] | Record<string, string> } = {
    argv: getNormalizedArgv(argv, cwd),
    linkedWorkers: {},
  }
  for (let i = 0; i < argv.length; i++) {
    const linkPath = getLinkPath(argv, i)
    if (!linkPath) {
      continue
    }
    const absolutePath = getAbsolutePath(linkPath, cwd)
    const workerKey = getWorkerKey(absolutePath)
    if (!workerKey) {
      continue
    }
    const remoteUrl = getRemoteUrl(absolutePath)
    config[workerKey] = remoteUrl
    config.linkedWorkers[workerKey] = pathToFileURL(absolutePath).toString()
  }
  return config
}
