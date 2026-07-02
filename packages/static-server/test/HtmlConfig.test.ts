import { expect, test } from '@jest/globals'
import * as HtmlConfig from '../src/parts/HtmlConfig/HtmlConfig.js'

test('injects escaped config before closing head', () => {
  const html = '<html><head><title>Test</title></head></html>'
  const result = HtmlConfig.injectConfig(html, {
    argv: ['--link', 'file:///tmp/<script>alert(1)</script>.js'],
    linkedWorkers: {},
  })

  expect(result).toContain('<script id="Config" type="application/json">')
  expect(result).toContain('\\u003cscript')
  expect(result).not.toContain('<script>alert(1)</script>')
})

test('replaces existing config', () => {
  const html = '<html><head><script id="Config" type="application/json">{"old":true}</script></head></html>'
  const result = HtmlConfig.injectConfig(html, {
    argv: [],
    editorWorkerUrl: '/remote/test/packages/editor-worker/dist/editorWorkerMain.js',
    linkedWorkers: {},
  })

  expect(result).not.toContain('"old":true')
  expect(result).toContain('"editorWorkerUrl":"/remote/test/packages/editor-worker/dist/editorWorkerMain.js"')
})
