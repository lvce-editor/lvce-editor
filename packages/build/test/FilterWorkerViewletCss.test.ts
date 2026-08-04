import { expect, test } from '@jest/globals'
import { filterWorkerViewletCss } from '../src/parts/FilterWorkerViewletCss/FilterWorkerViewletCss.ts'

test('removes CSS that is already bundled into App.css', () => {
  const workers = [
    {
      id: 'statusBarWorker',
      viewlet: {
        css: ['/css/parts/ViewletStatusBar.css', '/css/parts/Markdown.css'],
        name: 'StatusBar',
      },
    },
  ]

  expect(filterWorkerViewletCss(workers)).toEqual([
    {
      id: 'statusBarWorker',
      viewlet: {
        css: ['/css/parts/Markdown.css'],
        name: 'StatusBar',
      },
    },
  ])
})

test('preserves workers without viewlet CSS', () => {
  const workers = [{ id: 'fileSystemWorker' }, { id: 'aboutWorker', viewlet: { name: 'About' } }]

  expect(filterWorkerViewletCss(workers)).toEqual(workers)
})
