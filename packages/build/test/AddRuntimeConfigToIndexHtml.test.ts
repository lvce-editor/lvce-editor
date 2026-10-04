import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { expect, test } from '@jest/globals'
import * as AddRuntimeConfigToIndexHtml from '../src/parts/AddRuntimeConfigToIndexHtml/AddRuntimeConfigToIndexHtml.ts'

test('embeds runtime configuration while preserving existing config values', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'lvce-runtime-config-'))
  const path = join(dir, 'index.html')
  try {
    await writeFile(
      path,
      '<html><head><script id="Config" type="application/json">{"argv":["--test"],"html":"\\u003c/script>\\u003cscript>alert(1)\\u003c/script>","workerUrls":{"custom":"/custom.js","develop.editorWorkerPath":"/custom-editor.js"}}</script></head></html>',
    )

    await AddRuntimeConfigToIndexHtml.addRuntimeConfigToIndexHtml({
      path,
      platform: 'electron',
      assetDir: '/prefix/test-commit',
    })

    const html = await readFile(path, 'utf8')
    const textContent = html.match(/<script id="Config" type="application\/json">([\s\S]*?)<\/script>/)?.[1]
    expect(textContent).toBeDefined()
    const config = JSON.parse(textContent!)
    expect(config).toMatchObject({
      argv: ['--test'],
      assetDir: '/prefix/test-commit',
      html: '</script><script>alert(1)</script>',
      platform: 'electron',
      rendererWorkerUrl: '/prefix/test-commit/packages/renderer-worker/dist/rendererWorkerMain.js',
      workerUrls: {
        custom: '/custom.js',
        'develop.dragAndDropWorkerPath': '/prefix/test-commit/packages/drag-and-drop-worker/dist/dragAndDropWorkerMain.js',
        'develop.editorWorkerPath': '/custom-editor.js',
      },
    })
    expect(html).not.toContain('</script><script>alert(1)</script>')
    expect(html).not.toContain('renderer-worker/node_modules')
  } finally {
    await rm(dir, { force: true, recursive: true })
  }
})
