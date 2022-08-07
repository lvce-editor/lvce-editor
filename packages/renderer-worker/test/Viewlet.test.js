import { jest } from '@jest/globals'
import * as RendererProcess from '../src/parts/RendererProcess/RendererProcess.js'
import * as Viewlet from '../src/parts/Viewlet/Viewlet.js'

test.skip('focus', () => {
  RendererProcess.state.send = jest.fn()
  Viewlet.focus('Noop')
  expect(RendererProcess.state.send).toHaveBeenCalledWith([3027, 'Noop'])
})

test.skip('setState - shouldApplyNewState returns false', () => {
  Viewlet.state.instances['test'] = {
    factory: {
      hasFunctionalRender: true,
      render() {
        return []
      },
    },
    state: {},
  }
})
