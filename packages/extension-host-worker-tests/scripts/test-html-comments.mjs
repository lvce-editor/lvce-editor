import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import { originalText } from '../src/editor.toggle-comment-html.js'
export const test = async ({ page }) => {
  await page.locator('#TestOverlay').evaluate((element) => element.remove())
  const rendererEntry = await page
    .locator('script[type="module"][src]')
    .evaluateAll((elements) => elements.map((e) => e.src).find((src) => src.includes('rendererProcessMain')))
  const execute = (method, ...params) =>
    page.evaluate(async ({ rendererEntry, method, params }) => (await import(rendererEntry)).executeCommand(method, ...params), {
      rendererEntry,
      method,
      params,
    })
  const editorId = await execute('GetActiveEditor.getActiveEditorId')
  const command = (method, ...params) => execute('Viewlet.executeViewletCommand', editorId, method, ...params)
  const original = originalText
  const results = []
  const evidenceDirectory = process.env.HTML_COMMENT_EVIDENCE_DIR || '.tmp/html-comments'
  await mkdir(evidenceDirectory, { recursive: true })
  const check = async (label, expected) => {
    await page
      .waitForFunction(
        async ({ rendererEntry, expected }) => {
          const document = await (await import(rendererEntry)).executeCommand('GetActiveEditor.getTextDocument')
          return document?.text === expected
        },
        { rendererEntry, expected },
        { timeout: 3000 },
      )
      .catch(() => {})
    const actual = (await execute('GetActiveEditor.getTextDocument')).text
    results.push({ label, expected, actual })
    await writeFile(`${evidenceDirectory}/assertions.json`, JSON.stringify(results, null, 2))
    assert.equal(actual, expected, label)
  }
  await check('initial HTML document', original)
  await command('setSelections', [1, 2, 2, 20])
  await command('toggleComment')
  const js = original.replace('  const value', '  // const value').replace('  console.log', '  // console.log')
  await check('multiline indented module script', js)
  await command('undo')
  await check('undo', original)
  await command('redo')
  await check('redo', js)
  await command('toggleComment')
  await check('toggle back JS', original)
  for (const [label, row, column, before, after] of [
    ['cursor JS', 1, 5, '  const value = 1', '  // const value = 1'],
    ['CSS', 5, 5, '  body { color: red }', '  /*body { color: red }*/'],
    ['markup', 7, 5, '<div>content</div>', '<!--<div>content</div>-->'],
    ['opening tag', 0, 1, '<script type="module">', '<!--<script type="module">-->'],
    ['closing tag', 3, 1, '</script>', '<!--</script>-->'],
  ]) {
    await command('setSelections', [row, column, row, column])
    await command('toggleComment')
    await check(label, original.replace(before, after))
    await command('toggleComment')
    await check(`toggle back ${label}`, original)
  }
  console.log('HTML-COMMENTS-ACCEPTANCE-PASSED')
}
