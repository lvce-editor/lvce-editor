const ViewletMainHandleDropFilePath = await import('../src/parts/ViewletMain/ViewletMainHandleDropFilePath.js')
const RendererProcess = await import('../src/parts/RendererProcess/RendererProcess.js')

test('handleDropFilePath - split right', async () => {
  const state = {}
  const eventX = 10
  const eventY = 20
  const filePath = '/test/file.txt'
  expect(await ViewletMainHandleDropFilePath.handleDropFilePath(state, eventX, eventY, filePath)).toBe(state)
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith([])
})
