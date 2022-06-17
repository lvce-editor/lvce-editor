import { domOperation, check, test } from './utils.js'

test('Views', async () => {
  await domOperation('.ActivityBarItem[aria-label="Explorer"]', 'click')
  await check(
    '#SideBarContent',
    'contains',
    '.Viewlet[data-viewlet-id="Explorer"]'
  )
  await domOperation('.ActivityBarItem[aria-label="Search"]', 'click')
  await check(
    '#SideBarContent',
    'contains',
    '.Viewlet[data-viewlet-id="Search"]'
  )
  await domOperation('.ActivityBarItem[aria-label="Run and Debug"]', 'click')
  await check(
    '#SideBarContent',
    'contains',
    '.Viewlet[data-viewlet-id="RunAndDebug"]'
  )
  await domOperation('.ActivityBarItem[aria-label="Source Control"]', 'click')
  await check(
    '#SideBarContent',
    'contains',
    '.Viewlet[data-viewlet-id="SourceControl"]'
  )
  await domOperation('.ActivityBarItem[aria-label="Extensions"]', 'click')
  await check(
    '#SideBarContent',
    'contains',
    '.Viewlet[data-viewlet-id="Extensions"]'
  )
})
