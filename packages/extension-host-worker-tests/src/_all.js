import { chromium, expect } from '@playwright/test'
import { readdir } from 'fs/promises'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const SKIPPED = ['sample.reference-provider-error.html']

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..', '..', '..')

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
  const browser = await chromium.launch({
    headless: false,
    args: ['--enable-experimental-web-platform-features'], // enable isVisible Api in Chrome 103
  })
  const page = await browser.newPage()
  page.on('console', handleConsole)
  const testNames = await getPaths()
  for (const testName of testNames) {
    await testFile(page, testName)
  }
  await page.close()
  await browser.close()
}

main()
