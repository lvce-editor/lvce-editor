import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-paste-image-markdown'

export const test: Test = async ({ ClipBoard, Command, Editor, FileSystem, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  const markdownUri = `${tmpDir}/notes.md`
  const imageUri = `${tmpDir}/image.png`
  await FileSystem.writeFile(markdownUri, '')
  await Workspace.setPath(tmpDir)
  await Main.openUri(markdownUri)
  await ClipBoard.enableMemoryClipBoard()
  await Command.execute('ClipBoard.writeImage', new Blob([Uint8Array.from([137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 0])], { type: 'image/png' }))
  const image = await Command.execute('ClipBoard.readImage')
  if (!image || image.type !== 'image/png') {
    throw new Error('Expected the in-memory clipboard image to be readable')
  }

  await Command.execute('Editor.paste')

  await Editor.shouldHaveText('![image](image.png)')
  const firstImageContents = await FileSystem.readFile(imageUri)
  await Command.execute('Editor.undo')
  await Editor.shouldHaveText('')
  await Command.execute('Editor.redo')
  await Editor.shouldHaveText('![image](image.png)')

  await Command.execute('ClipBoard.writeImage', new Blob(['second image contents'], { type: 'image/png' }))
  await Command.execute('Editor.paste')

  await Editor.shouldHaveText('![image](image.png)![image](image-1.png)')
  const savedFirstImageContents = await FileSystem.readFile(imageUri)
  if (savedFirstImageContents !== firstImageContents) {
    throw new Error('Pasting a second image must preserve the existing image file')
  }
  await FileSystem.readFile(`${tmpDir}/image-1.png`)
}
