import { chromium, expect } from '@playwright/test'
import { fork } from 'child_process'
import { readdir, rm } from 'fs/promises'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const SKIPPED = [
  'sample.reference-provider-error.html',
  'sample.reference-provider-no-results.html',
]

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..', '..', '..')

const SERVER_PATH = join(root, 'packages', 'server', 'src', 'server.js')

const isTestFile = (dirent) => {
  return dirent.endsWith('.html') && dirent !== 'index.html'
}

const getRelativePath = (testFile) => {
  return join(__dirname, testFile).slice(root.length)
}

const getPaths = async () => {
  const dirents = await readdir(__dirname)
  const testFiles = dirents.filter(isTestFile)
  return testFiles
}

const testFile = async (page, name) => {
  if (SKIPPED.includes(name)) {
    console.info(`[skipped] ${name}`)
    return
  }
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
      throw new Error(`Test Failed: ${text}`)
    default:
      throw new Error(`unexpected test state: ${state}`)
  }
}

const handleConsole = (event) => {
  console.log(event)
}

const main = async () => {
  const server = fork(SERVER_PATH, { stdio: 'inherit' })
  const argv = process.argv
  const headless = argv.includes('--headless')
  const recordVideos = argv.includes('--record-videos')
  if (recordVideos) {
    await rm(join(__dirname, '..', 'videos'), { recursive: true, force: true })
  }
  const browser = await chromium.launch({
    headless,
    args: ['--enable-experimental-web-platform-features'], // enable isVisible Api in Chrome 103
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
    server.kill('SIGKILL')
  }
}

main()
