import { readdirSync } from 'node:fs'
import { join } from 'node:path'
import { performance } from 'node:perf_hooks'
import { pathToFileURL } from 'node:url'
import { closeAll, runTest, startAll, state, root } from './_testFrameWork.js'

const getTestFiles = async () => {
  return readdirSync(join(root, 'packages', 'e2e', 'src'))
    .filter((x) => x !== '_all.js' && x !== '_testFrameWork.js')
    .map((x) => join(root, 'packages', 'e2e', 'src', x))
}

const main = async () => {
  try {
    let skipped = 0
    let passed = 0
    const start = performance.now()
    state.runImmediately = false
    await startAll()
    console.info('SETUP COMPLETE')
    const testFiles = await getTestFiles()
    console.log({ testFiles })
    for (const testFile of testFiles) {
      state.tests = []
      const testUri = pathToFileURL(testFile).toString()
      await import(testUri)
      for (const test of state.tests) {
        if (test.status === 'skipped') {
          skipped++
        } else {
          await runTest(test)
          passed++
        }
      }
    }
    const end = performance.now()
    const duration = end - start
    if (skipped) {
      console.info(
        `${passed} tests passed, ${skipped} tests skipped in ${duration}ms`
      )
    } else {
      console.info(`${passed} tests passed in ${duration}ms`)
    }
  } catch (error) {
    console.info('tests failed')
    console.error(error)
    process.exit(1)
  } finally {
    await closeAll()
  }
}

main()
