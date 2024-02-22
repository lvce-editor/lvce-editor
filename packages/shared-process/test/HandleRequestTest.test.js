import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/GetTestRequestResponse/GetTestRequestResponse.js', () => ({
  getTestRequestResponse: jest.fn(() => {
    throw new Error('not implemented')
  }),
}))

const GetTestRequestResponse = await import('../src/parts/GetTestRequestResponse/GetTestRequestResponse.js')
const HandleRequestTest = await import('../src/parts/HandleRequestTest/HandleRequestTest.js')

test.skip('handleRequestTest', async () => {
  const request = {}
  const socket = {}
  jest.spyOn(GetTestRequestResponse, 'getTestRequestResponse').mockResolvedValue({
    body: 'test',
    init: {
      status: 200,
    },
  })
  await HandleRequestTest.handleRequestTest(request, socket)
})
