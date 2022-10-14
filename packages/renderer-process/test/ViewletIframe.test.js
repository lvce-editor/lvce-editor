/**
 * @jest-environment jsdom
 */
import * as ViewletIframe from '../src/parts/ViewletIframe/ViewletIframe.js'

// TODO find a good way to test html elements

test('create', () => {
  const state = ViewletIframe.create()
  expect(state.$Viewlet).toMatchInlineSnapshot(`
    <iframe
      class="Viewlet"
      data-type="Iframe"
    />
  `)
})

test('setUrl', () => {
  const state = ViewletIframe.create()
  ViewletIframe.setUrl(state, 'https://example.com')
  expect(state.$Viewlet).toMatchInlineSnapshot(`
    <iframe
      class="Viewlet"
      data-type="Iframe"
      src="https://example.com"
    />
  `)
})

test('dispose', () => {
  const state = ViewletIframe.create()
  ViewletIframe.dispose(state)
})
