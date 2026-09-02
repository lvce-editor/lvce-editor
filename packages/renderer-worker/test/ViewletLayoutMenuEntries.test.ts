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

test('getQuickPickMenuEntries includes reset view locations command', () => {
  const entries = ViewletLayoutMenuEntries.getQuickPickMenuEntries()

  expect(entries).toContainEqual({
    id: 'Layout.resetViewLocations',
    label: 'Layout: Reset View Locations',
    aliases: ['View: Reset View Locations'],
  })
})

test('getQuickPickMenuEntries includes executable keybindings commands', () => {
  const entries = ViewletLayoutMenuEntries.getQuickPickMenuEntries()

  expect(entries).toEqual(
    expect.arrayContaining([
      {
        id: 'Preferences.openKeyBindingsJson',
        label: 'Preferences: Open User Key Bindings',
      },
      {
        id: 'Main.openKeyBindings',
        label: 'Preferences: Open Default Key Bindings',
        aliases: ['Set Key Bindings', 'Key Map', 'Key Mapping'],
      },
    ]),
  )
})

test('getQuickPickMenuEntries includes preview orientation command', () => {
  const entries = ViewletLayoutMenuEntries.getQuickPickMenuEntries()

  expect(entries).toContainEqual({
    id: 'Layout.togglePreviewOrientation',
    label: 'Preview: Toggle Orientation',
    aliases: ['Toggle Preview Orientation', 'Stack Preview Areas'],
  })
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

test('getQuickPickMenuEntries includes secrets command', () => {
  const entries = ViewletLayoutMenuEntries.getQuickPickMenuEntries()

  expect(entries).toContainEqual({
    id: 'Main.openUri',
    label: 'Preferences: Open Secrets',
    args: ['secrets://'],
    aliases: ['Manage Secrets'],
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

test('getQuickPickMenuEntries includes simple browser history command', () => {
  const entries = ViewletLayoutMenuEntries.getQuickPickMenuEntries()

  expect(entries).toContainEqual({
    id: 'Main.openUri',
    label: 'Simple Browser: Open History',
    args: ['simple-browser-history://'],
    aliases: ['Open Browser History'],
  })
})

test('getQuickPickMenuEntries includes Firefox cookie import command', () => {
  const entries = ViewletLayoutMenuEntries.getQuickPickMenuEntries()

  expect(entries).toContainEqual({
    id: 'Main.openUri',
    label: 'Simple Browser: Import Cookies from Firefox',
    args: ['cookie-import-view:///'],
    aliases: ['Open Cookie Importer'],
  })
})

test('getQuickPickMenuEntries includes close all editors command', () => {
  const entries = ViewletLayoutMenuEntries.getQuickPickMenuEntries()

  expect(entries).toContainEqual({
    id: 'Main.closeAllEditors',
    label: 'Main: Close all Editors',
  })
})

test('getQuickPickMenuEntries includes executable open recent command', () => {
  const entries = ViewletLayoutMenuEntries.getQuickPickMenuEntries()

  expect(entries).toContainEqual({
    id: 'QuickPick.showRecent',
    label: 'File: Open Recent',
  })
})
