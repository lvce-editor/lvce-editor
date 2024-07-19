import { expect, test } from '@jest/globals'
import * as FormatDate from '../src/parts/FormatDate/FormatDate.js'

const millisecond = 1
const second = 1000 * millisecond
const minute = 60 * second
const hour = minute * 60
const day = hour * 24
const week = day * 7
const month = day * 30
const year = day * 365
const now = new Date(0).getTime() + 10 * year

test('formatDate - 1 millisecond ago', () => {
  const date = now - millisecond
  expect(FormatDate.formatDate(date, now)).toBe('0 seconds ago')
})

test('formatDate - 1 second ago', () => {
  const date = now - second
  expect(FormatDate.formatDate(date, now)).toBe('1 second ago')
})

test('formatDate - 2 seconds ago', () => {
  const date = now - 2 * second
  expect(FormatDate.formatDate(date, now)).toBe('2 seconds ago')
})

test('formatDate - 1 minute ago', () => {
  const date = now - minute
  expect(FormatDate.formatDate(date, now)).toBe('1 minute ago')
})

test('formatDate - 2 minutes ago', () => {
  const date = now - 2 * minute
  expect(FormatDate.formatDate(date, now)).toBe('2 minutes ago')
})

test('formatDate - 1 hour ago', () => {
  const date = now - hour
  expect(FormatDate.formatDate(date, now)).toBe('1 hour ago')
})

test('formatDate - 2 hours ago', () => {
  const date = now - 2 * hour
  expect(FormatDate.formatDate(date, now)).toBe('2 hours ago')
})

test('formatDate - 1 day ago', () => {
  const date = now - day
  expect(FormatDate.formatDate(date, now)).toBe('1 day ago')
})

test('formatDate - 2 days ago', () => {
  const date = now - 2 * day
  expect(FormatDate.formatDate(date, now)).toBe('2 days ago')
})

test('formatDate - 1 week ago', () => {
  const date = now - week
  expect(FormatDate.formatDate(date, now)).toBe('1 week ago')
})

test('formatDate - 2 weeks ago', () => {
  const date = now - 2 * week
  expect(FormatDate.formatDate(date, now)).toBe('2 weeks ago')
})

test('formatDate - 1 month ago', () => {
  const date = now - month
  expect(FormatDate.formatDate(date, now)).toBe('1 month ago')
})

test('formatDate - 2 months ago', () => {
  const date = now - 2 * month
  expect(FormatDate.formatDate(date, now)).toBe('2 months ago')
})

test('formatDate - 1 year ago', () => {
  const date = now - year
  expect(FormatDate.formatDate(date, now)).toBe('1 year ago')
})

test('formatDate - 2 years ago', () => {
  const date = now - 2 * year
  expect(FormatDate.formatDate(date, now)).toBe('2 years ago')
})

test('formatDate - in 2 hours', () => {
  const date = now + 2 * hour
  expect(FormatDate.formatDate(date, now)).toBe('in 2 hours')
})
