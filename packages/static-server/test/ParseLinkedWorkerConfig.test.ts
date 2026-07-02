import { expect, test } from '@jest/globals'
import * as ParseLinkedWorkerConfig from '../src/parts/ParseLinkedWorkerConfig/ParseLinkedWorkerConfig.js'

test('parses linked editor worker', () => {
  const config = ParseLinkedWorkerConfig.parseLinkedWorkerConfig(['--link', './packages/editor-worker/dist/editorWorkerMain.js'], '/test')

  expect(config).toEqual({
    argv: ['--link', 'file:///test/packages/editor-worker/dist/editorWorkerMain.js'],
    editorWorkerUrl: '/remote/test/packages/editor-worker/dist/editorWorkerMain.js',
    linkedWorkers: {
      editorWorkerUrl: 'file:///test/packages/editor-worker/dist/editorWorkerMain.js',
    },
  })
})

test('parses multiple linked workers with equals syntax', () => {
  const config = ParseLinkedWorkerConfig.parseLinkedWorkerConfig(
    ['--link=../editor-worker/dist/editorWorkerMain.js', '--link=../test-worker/dist/testWorkerMain.js'],
    '/test/packages/extension-host-worker',
  )

  expect(config.editorWorkerUrl).toBe('/remote/test/packages/editor-worker/dist/editorWorkerMain.js')
  expect(config.testWorkerUrl).toBe('/remote/test/packages/test-worker/dist/testWorkerMain.js')
  expect(config.argv).toEqual([
    '--link=file:///test/packages/editor-worker/dist/editorWorkerMain.js',
    '--link=file:///test/packages/test-worker/dist/testWorkerMain.js',
  ])
})

test('ignores unknown linked worker path', () => {
  const config = ParseLinkedWorkerConfig.parseLinkedWorkerConfig(['--link', './packages/unknown-worker/dist/unknownWorkerMain.js'], '/test')

  expect(config).toEqual({
    argv: ['--link', 'file:///test/packages/unknown-worker/dist/unknownWorkerMain.js'],
    linkedWorkers: {},
  })
})

test('parses file url link paths', () => {
  const config = ParseLinkedWorkerConfig.parseLinkedWorkerConfig(['--link=file:///test/packages/editor-worker/dist/editorWorkerMain.js'], '/other')

  expect(config).toEqual({
    argv: ['--link=file:///test/packages/editor-worker/dist/editorWorkerMain.js'],
    editorWorkerUrl: '/remote/test/packages/editor-worker/dist/editorWorkerMain.js',
    linkedWorkers: {
      editorWorkerUrl: 'file:///test/packages/editor-worker/dist/editorWorkerMain.js',
    },
  })
})
