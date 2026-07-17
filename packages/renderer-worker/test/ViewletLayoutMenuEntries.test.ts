import { expect, test } from '@jest/globals'
import * as ViewletLayoutMenuEntries from '../src/parts/ViewletLayout/ViewletLayoutMenuEntries.js'

test('getQuickPickMenuEntries includes chat commands', () => {
  const entries = ViewletLayoutMenuEntries.getQuickPickMenuEntries()

  expect(entries).toEqual(
    expect.arrayContaining([
      {
        id: 'Layout.signIn',
        label: 'Account: Sign In',
        aliases: ['Sign In', 'Log In', 'Account Login'],
      },
      {
        id: 'Layout.signOut',
        label: 'Account: Sign Out',
        aliases: ['Sign Out', 'Log Out', 'Account Logout'],
      },
      {
        id: 'Layout.openChat',
        label: 'Layout: Open Chat',
        aliases: ['Show Chat'],
      },
      {
        id: 'Layout.closeChat',
        label: 'Layout: Close Chat',
        aliases: ['Hide Chat'],
      },
    ]),
  )
})

test('getQuickPickMenuEntries includes GPU info command', () => {
  const entries = ViewletLayoutMenuEntries.getQuickPickMenuEntries()

  expect(entries).toContainEqual({
    id: 'Developer.showGpuInfo',
    label: 'Developer: Show GPU Info',
  })
})

test('getQuickPickMenuEntries includes running extensions command', () => {
  const entries = ViewletLayoutMenuEntries.getQuickPickMenuEntries()

  expect(entries).toContainEqual({
    id: 'Main.openUri',
    label: 'Developer: Show Running Extensions',
    args: ['running-extensions://'],
  })
})

test('getQuickPickMenuEntries includes extension management worker latency command', () => {
  const entries = ViewletLayoutMenuEntries.getQuickPickMenuEntries()

  expect(entries).toContainEqual({
    id: 'Developer.measureExtensionManagementWorkerLatency',
    label: 'Developer: Measure Extension Management Worker Latency',
  })
})

test('getQuickPickMenuEntries includes simple browser preview command', () => {
  const entries = ViewletLayoutMenuEntries.getQuickPickMenuEntries()

  expect(entries).toContainEqual({
    id: 'Layout.showPreview',
    label: 'Simple Browser: Open in Preview Area',
    args: ['simple-browser://'],
  })
})

test('getQuickPickMenuEntries includes close all editors command', () => {
  const entries = ViewletLayoutMenuEntries.getQuickPickMenuEntries()

  expect(entries).toContainEqual({
    id: 'Main.closeAllEditors',
    label: 'Main: Close all Editors',
  })
})
