import { mkdir, writeFile } from 'node:fs/promises'
import { resolve, join } from 'node:path'
import { pathToFileURL } from 'node:url'

// Reuse the owner's scenario unchanged; persist its existing capture on failure.
const owner = resolve('../../.tmp/direct-editor-tests/packages/e2e-integration/scripts/test-direct-editor-events.mjs')
const scenario = await import(pathToFileURL(owner).href)

export const test = async (context) => {
  const { page } = context
  const errors = []
  page.on('pageerror', (error) => errors.push({ time: Date.now(), message: error.stack || String(error) }))
  let failure
  try {
    await scenario.test(context)
  } catch (error) {
    failure = error
    throw error
  } finally {
    const rendererWorker = page.workers().find((worker) => /\/renderer-worker\/(?:src|dist)\/rendererWorkerMain/.test(worker.url()))
    const capture = async (operation) => {
      try {
        return await operation()
      } catch (error) {
        return { captureError: String(error) }
      }
    }
    const timeline = await capture(() => page.evaluate(() => globalThis.directEditorTrace || []))
    const workerTrace = await capture(() => rendererWorker?.evaluate(() => globalThis.directWorkerTrace || []))
    const evidence = process.env.LVCE_DIRECT_EVENTS_EVIDENCE_DIR
    await mkdir(evidence, { recursive: true })
    await writeFile(
      join(evidence, `allmessages-viewlet.editor-direct-events-${process.env.LVCE_ATTEMPT}.json`),
      JSON.stringify({ failure: failure?.stack, errors, timeline, workerTrace }, null, 2),
    )
  }
}
