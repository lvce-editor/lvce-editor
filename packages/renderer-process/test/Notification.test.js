/**
 * @jest-environment jsdom
 */
import { test } from '@jest/globals'
import * as Notification from '../src/parts/Notification/Notification.js'

// TODO test dispose
test('Notification', () => {
  Notification.create('info', 'test info')
  Notification.create('error', 'test error')
})
