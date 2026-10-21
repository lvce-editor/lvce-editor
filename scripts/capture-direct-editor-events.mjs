import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { test as runTest } from '../.tmp/direct-editor-tests/packages/e2e-integration/scripts/test-direct-editor-events.mjs'

export const test = async (args) => {
  const { page } = args
  const workers = page.workers().filter((worker) => /editor-worker\/(?:src|dist)\/editorWorkerMain/.test(worker.url()))
  for (const worker of workers) {
    await worker.evaluate(() => {
      const events = []
      const ports = new WeakSet()
      const original = MessagePort.prototype.postMessage
      MessagePort.prototype.postMessage = function (message, ...rest) {
        if (!ports.has(this)) {
          ports.add(this)
          this.addEventListener('message', ({ data }) => events.push({ direction: 'receive', message: data, time: performance.now() }))
        }
        events.push({ direction: 'send', message, time: performance.now() })
        return original.call(this, message, ...rest)
      }
      globalThis.completionDiagnosticEvents = events
    })
  }
  try {
    await runTest(args)
  } catch (error) {
    try {
      const output = process.env.LVCE_DIRECT_EVENTS_EVIDENCE_DIR || '.tmp/direct-editor-events'
      await mkdir(output, { recursive: true })
      // Capture after failure so evidence collection cannot synchronize the test.
      const state = await page.evaluate(async () => {
        const entry = [...document.querySelectorAll('script[type="module"][src]')].find((script) => script.src.includes('rendererProcessMain')).src
        const renderer = await import(entry)
        return {
          activeElement: document.activeElement?.outerHTML,
          completionDom: [...document.querySelectorAll('.EditorCompletion')].map((element) => element.outerHTML),
          document: await renderer.executeCommand('GetActiveEditor.getTextDocument'),
          selections: await renderer.executeCommand('GetActiveEditor.getSelections'),
          trace: globalThis.directEditorTrace,
        }
      })
      const editorWorkers = await Promise.all(
        workers.map(async (worker) => ({ url: worker.url(), events: await worker.evaluate(() => globalThis.completionDiagnosticEvents) })),
      )
      await writeFile(join(output, 'failure.json'), JSON.stringify({ error: String(error), state, editorWorkers }, null, 2))
      await page.screenshot({ path: join(output, 'failure.png') })
    } catch (captureError) {
      console.error('Could not capture direct editor evidence:', captureError)
    }
    throw error
  }
}
