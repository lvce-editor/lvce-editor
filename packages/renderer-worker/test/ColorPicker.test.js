import { jest } from '@jest/globals'
import * as ColorPicker from '../src/parts/ColorPicker/ColorPicker.js'
import * as RendererProcess from '../src/parts/RendererProcess/RendererProcess.js'

// TODO actual tests
test('open', async () => {
  RendererProcess.state.send = jest.fn()
  ColorPicker.open()
  expect(RendererProcess.state.send).not.toHaveBeenCalled()
})

test('close', async () => {
  RendererProcess.state.send = jest.fn()
  ColorPicker.close()
  expect(RendererProcess.state.send).not.toHaveBeenCalled()
})
