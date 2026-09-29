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

test('removes eagerly loaded main area CSS', () => {
  const workers = [
    {
      id: 'mainArea',
      viewlet: {
        css: [
          '/css/parts/ViewletMainDragOverlay.css',
          '/css/parts/ViewletMainEditorGroup.css',
          '/css/parts/ViewletMainWaterMark.css',
          '/css/parts/ViewletMain.css',
        ],
        name: 'Main',
      },
    },
  ]

  expect(filterWorkerViewletCss(workers)).toEqual([
    {
      id: 'mainArea',
      viewlet: {
        css: [],
        name: 'Main',
      },
    },
  ])
})

test('preserves workers without viewlet CSS', () => {
  const workers = [{ id: 'fileSystemWorker' }, { id: 'aboutWorker', viewlet: { name: 'About' } }]

  expect(filterWorkerViewletCss(workers)).toEqual(workers)
})
