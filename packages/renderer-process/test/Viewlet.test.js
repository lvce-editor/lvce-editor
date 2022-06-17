/**
 * @jest-environment jsdom
 */
import * as Viewlet from '../src/parts/Viewlet/Viewlet.js'
import * as Layout from '../src/parts/Layout/Layout.js'

beforeEach(() => {
  Layout.state.$SideBar = document.createElement('div')
})

test.skip('appendViewlet', async () => {
  await Viewlet.hydrate('SideBar', [])
  expect(Layout.state.$SideBar.children).toHaveLength(2)
})

test.skip('appendViewlet - callbacks should be invoked', async () => {
  await Viewlet.hydrate('SideBar', [])
  Viewlet.invoke('Extensions', 'setExtensions', [])
  await Viewlet.appendViewlet('SideBar', 'Extensions')
  expect(
    Viewlet.state.instances.SideBar.state.$SideBar.textContent
  ).toContain('ExtensionsNo extensions found.')
})
