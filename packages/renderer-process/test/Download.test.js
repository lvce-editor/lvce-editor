/**
 * @jest-environment jsdom
 */
import * as Download from '../src/parts/Download/Download.js'
import { jest } from '@jest/globals'

test('downloadFile', () => {
  // arrange
  const spyCreateElement = jest.spyOn(document, 'createElement')
  const spyDownload = jest.spyOn(HTMLAnchorElement.prototype, 'download', 'set')
  const spyHref = jest.spyOn(HTMLAnchorElement.prototype, 'href', 'set')
  const spyClick = jest.spyOn(HTMLElement.prototype, 'click')

  // act
  Download.downloadFile('test.txt', 'test://test-url')

  // assert
  expect(spyCreateElement).toHaveBeenCalledTimes(1)
  expect(spyCreateElement).toHaveBeenCalledWith('a')
  expect(spyDownload).toHaveBeenCalledTimes(1)
  expect(spyDownload).toHaveBeenCalledWith('test.txt')
  expect(spyHref).toHaveBeenCalledTimes(1)
  expect(spyHref).toHaveBeenCalledWith('test://test-url')
  expect(spyClick).toHaveBeenCalledTimes(1)
})
