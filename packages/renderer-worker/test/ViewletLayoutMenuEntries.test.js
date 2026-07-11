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

test('getQuickPickMenuEntries includes extension management worker latency command', () => {
  const entries = ViewletLayoutMenuEntries.getQuickPickMenuEntries()

  expect(entries).toContainEqual({
    id: 'Developer.measureExtensionManagementWorkerLatency',
    label: 'Developer: Measure Extension Management Worker Latency',
  })
})
