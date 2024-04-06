/**
 * @jest-environment jsdom
 */
import { beforeEach, expect, test } from '@jest/globals'
import * as Layout from '../src/parts/Layout/Layout.ts'
import * as Viewlet from '../src/parts/Viewlet/Viewlet.ts'

beforeEach(() => {
  // @ts-ignore
  Layout.state.$SideBar = document.createElement('div')
})

test.skip('appendViewlet', async () => {
  // @ts-ignore
  await Viewlet.hydrate('SideBar', [])
  // @ts-ignore
  expect(Layout.state.$SideBar.children).toHaveLength(2)
})

test.skip('appendViewlet - callbacks should be invoked', async () => {
  // @ts-ignore
  await Viewlet.hydrate('SideBar', [])
  Viewlet.invoke('Extensions', 'setExtensions', [])
  // @ts-ignore
  await Viewlet.appendViewlet('SideBar', 'Extensions')
  expect(Viewlet.state.instances.SideBar.state.$SideBar.textContent).toContain('ExtensionsNo extensions found.')
})
