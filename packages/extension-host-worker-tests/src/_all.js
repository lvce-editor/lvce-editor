import { chromium, expect } from '@playwright/test'
import { fork } from 'child_process'
import { readdir, rm } from 'fs/promises'
import { mkdtemp } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import cors from 'cors'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..', '..', '..')

const SERVER_PATH = join(root, 'packages', 'server', 'src', 'server.js')
const CI_DIST_PATH = join(root, 'packages', 'build', '.tmp', 'export-test', 'dist')

const isTestFile = (dirent) => {
  return dirent !== '_all.js'
}

const getRelativePath = (testFile) => {
  if (testFile.endsWith('.ts')) {
    return join(root, 'tests', testFile.replace('.ts', '.html')).slice(root.length)
  }
  return join(root, 'tests', testFile.replace('.js', '.html')).slice(root.length)
}

const getPaths = async () => {
  const testsPath = join(root, 'packages', 'extension-host-worker-tests', 'src')
  const dirents = await readdir(testsPath)
  const testFiles = dirents.filter(isTestFile)
  return testFiles
}

const testFile = async (page, name) => {
  const relativePath = getRelativePath(name)
  const url = `http://localhost:3000${relativePath}`
  await page.goto(url)
  const testOverlay = page.locator('#TestOverlay')
  await expect(testOverlay).toBeVisible({ timeout: 25_000 })
  const text = await testOverlay.textContent()
  const state = await testOverlay.getAttribute('data-state')
  switch (state) {
    case 'pass':
      break
    case 'skip':
      break
    case 'fail':
      throw new Error(`Test Failed: ${name}: ${text}`)
    default:
      throw new Error(`unexpected test state: ${state}`)
  }
}

const handleConsole = (event) => {
  console.log(event)
}

const getTmpDir = () => {
  return mkdtemp(join(tmpdir(), 'foo-'))
}

const launchServer = async ({ ci, configDir, cacheDir, dataDir }) => {
  if (ci) {
    const app = express()
    app.use(cors({}))
    app.use(
      express.static(CI_DIST_PATH, {
        immutable: true,
        maxAge: 86400,
      }),
    )
    const { resolve, promise } = Promise.withResolvers()
    const server = app.listen(3000, 'localhost', () => resolve(undefined))
    await promise
    return {
      dispose() {
        server.close()
      },
    }
  }
  const server = fork(SERVER_PATH, {
    stdio: 'inherit',
    env: {
      XDG_CONFIG_HOME: configDir,
      XDG_CACHE_HOME: cacheDir,
      XDG_DATA_HOME: dataDir,
    },
  })
  return {
    dispose() {
      server.kill('SIGKILL')
    },
  }
}

const runTests = async () => {
  // TODO use build tmp folder
  const configDir = await getTmpDir()
  const cacheDir = await getTmpDir()
  const dataDir = await getTmpDir()
  const argv = process.argv
  const headless = argv.includes('--headless')
  const ci = argv.includes('--ci')
  const serve = argv.includes('--serve')
  const server = await launchServer({
    configDir,
    cacheDir,
    ci,
    dataDir,
  })
  if (serve) {
    console.info('[server] listening on http://localhost:3000')
    return
  }
  const recordVideos = argv.includes('--record-videos')
  if (recordVideos) {
    await rm(join(__dirname, '..', 'videos'), { recursive: true, force: true })
  }
  const browser = await chromium.launch({
    headless,
    args: [],
  })
  const context = await browser.newContext({
    recordVideo: recordVideos
      ? {
          dir: join(__dirname, '..', 'videos'),
          size: { width: 1280, height: 720 },
        }
      : undefined,
  })
  const page = await context.newPage()
  try {
    page.on('console', handleConsole)
    const testNames = await getPaths()
    for (const testName of testNames) {
      await testFile(page, testName)
    }
  } catch (error) {
    throw error
  } finally {
    await page.close()
    await context.close()
    await browser.close()
    server.dispose()
  }
}

const main = async () => {
  try {
    await runTests()
  } catch (error) {
    if (error && error instanceof Error) {
      console.error(error.message)
    } else {
      console.error(error)
    }
    process.exitCode = 128
  }
}

main()
