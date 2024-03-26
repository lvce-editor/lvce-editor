import { expect, test } from '@jest/globals'
import * as ListProcessGetName from '../src/parts/ListProcessGetName/ListProcessGetName.js'

test('getName - detect chrome devtools', () => {
  const pid = 200152
  const cmd =
    'packages/main-process/node_modules/electron/dist/electron --type=renderer --enable-crashpad --enable-crash-reporter=d476773f-ae60-4c60-85c5-d4f2eb675cee,no_channel --user-data-dir=/test.config/main-process --standard-schemes=lvce-oss --enable-sandbox --secure-schemes=lvce-oss --bypasscsp-schemes --cors-schemes --fetch-schemes=lvce-oss --service-worker-schemes --streaming-schemes=lvce-oss --app-path=/packages/main-process --lang=en-US --num-raster-threads=4 --enable-main-frame-before-activation --renderer-client-id=7 --launch-time-ticks=6086771284 --shared-files=v8_context_snapshot_data:100 --field-trial-handle=0,i,17047493330214191737,6951987383812573163,131072 --disable-features=SpareRendererForSitePerProcess'
  const rootPid = 1
  const pidMap = {
    200152: 'chrome-devtools',
  }
  expect(ListProcessGetName.getName(pid, cmd, rootPid, pidMap)).toBe('chrome-devtools')
})

test('getName - detect renderer', () => {
  const pid = 200152
  const cmd =
    '/packages/main-process/node_modules/electron/dist/electron --type=renderer --enable-crashpad --enable-crash-reporter=d476773f-ae60-4c60-85c5-d4f2eb675cee,no_channel --user-data-dir=/test.config/main-process --standard-schemes=lvce-oss --enable-sandbox --secure-schemes=lvce-oss --bypasscsp-schemes --cors-schemes --fetch-schemes=lvce-oss --service-worker-schemes --streaming-schemes=lvce-oss --app-path=/packages/main-process --lang=en-US --num-raster-threads=4 --enable-main-frame-before-activation --renderer-client-id=7 --launch-time-ticks=6086771284 --shared-files=v8_context_snapshot_data:100 --field-trial-handle=0,i,17047493330214191737,6951987383812573163,131072 --disable-features=SpareRendererForSitePerProcess'
  const rootPid = 1
  const pidMap = {
    200152: 'renderer',
  }
  expect(ListProcessGetName.getName(pid, cmd, rootPid, pidMap)).toBe('renderer')
})

test('getName - unknown renderer', () => {
  const pid = 200152
  const cmd =
    '/packages/main-process/node_modules/electron/dist/electron --type=renderer --enable-crashpad --enable-crash-reporter=d476773f-ae60-4c60-85c5-d4f2eb675cee,no_channel --user-data-dir=/test.config/main-process --standard-schemes=lvce-oss --enable-sandbox --secure-schemes=lvce-oss --bypasscsp-schemes --cors-schemes --fetch-schemes=lvce-oss --service-worker-schemes --streaming-schemes=lvce-oss --app-path=/packages/main-process --lang=en-US --num-raster-threads=4 --enable-main-frame-before-activation --renderer-client-id=7 --launch-time-ticks=6086771284 --shared-files=v8_context_snapshot_data:100 --field-trial-handle=0,i,17047493330214191737,6951987383812573163,131072 --disable-features=SpareRendererForSitePerProcess'
  const rootPid = 1
  const pidMap = {}
  expect(ListProcessGetName.getName(pid, cmd, rootPid, pidMap)).toBe('renderer')
})

test('getName - detect pty host', () => {
  const pid = 123
  const cmd = 'node dist/ptyHostMain.js'
  const rootPid = 1
  const pidMap = {}
  expect(ListProcessGetName.getName(pid, cmd, rootPid, pidMap)).toBe('pty-host')
})

test('getName - detect extension host helper process', () => {
  const pid = 123
  const cmd = 'node dist/extensionHostHelperProcessMain.js'
  const rootPid = 1
  const pidMap = {}
  expect(ListProcessGetName.getName(pid, cmd, rootPid, pidMap)).toBe('extension-host-helper-process')
})

test('getName - detect sublime', () => {
  const pid = 123
  const cmd = '/opt/sublime_text/sublime_text --fwdargv0 /usr/bin/subl'
  const rootPid = 1
  const pidMap = {}
  expect(ListProcessGetName.getName(pid, cmd, rootPid, pidMap)).toBe('sublime-text')
})
