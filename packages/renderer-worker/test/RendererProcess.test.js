const RendererProcess = await import(
  '../src/parts/RendererProcess/RendererProcess.js'
)

test('invoke - error', async () => {
  await expect(
    RendererProcess.invoke(
      'TestFrameWork.checkSingleElementCondition',
      {
        _selector: '.Viewlet.Editor',
        _nth: -1,
        _hasText: '',
      },
      'toHaveText',
      {
        text: 'test3',
      }
    )
  ).rejects.toThrowError(new Error('abc'))
})
