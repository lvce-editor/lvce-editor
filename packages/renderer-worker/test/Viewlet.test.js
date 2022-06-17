import { jest } from '@jest/globals'
import * as RendererProcess from '../src/parts/RendererProcess/RendererProcess.js'
import * as Viewlet from '../src/parts/Viewlet/Viewlet.js'
import * as ViewletNoop from '../src/parts/Viewlet/ViewletNoop.js'

test.skip('focus', () => {
  RendererProcess.state.send = jest.fn()
  Viewlet.focus('Noop')
  expect(RendererProcess.state.send).toHaveBeenCalledWith([3027, 'Noop'])
})
