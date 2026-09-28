import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'workspace.local-uri-path'

export const test: Test = async ({ Command, FileSystem }) => {
  const uri = await FileSystem.getTmpDir({ scheme: 'file' })
  await FileSystem.writeFile(`${uri}/workspace-path.txt`, 'workspace path content')

  await Command.execute('Workspace.setUri', uri)

  const path = await Command.execute('Workspace.getPath')
  if (/^\/[A-Za-z]:\//.test(path)) {
    throw new Error(`Workspace path has an invalid leading slash: ${path}`)
  }
  const content = await Command.execute('FileSystem.readFile', `${path}/workspace-path.txt`)
  if (content !== 'workspace path content') {
    throw new Error('Workspace path must point to the local workspace folder')
  }
}
