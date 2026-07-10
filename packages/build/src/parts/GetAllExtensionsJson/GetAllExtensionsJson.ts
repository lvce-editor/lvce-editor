import { readdir } from 'node:fs/promises'
import { join } from 'node:path'
import * as JsonFile from '../JsonFile/JsonFile.ts'
import * as Path from '../Path/Path.ts'

interface GetAllExtensionsJsonOptions {
  readonly commitHash: string
  readonly pathPrefix: string
}

export const getAllExtensionsJson = async ({ pathPrefix, commitHash }: GetAllExtensionsJsonOptions): Promise<readonly any[]> => {
  const extensionPath = Path.absolute('extensions')
  const extensions = await readdir(extensionPath)
  const allContent: any[] = []
  for (const extension of extensions) {
    const absolutePath = join(extensionPath, extension, 'extension.json')
    const content = await JsonFile.readJson(absolutePath)
    allContent.push({
      ...content,
      builtin: true,
      path: `${pathPrefix}/${commitHash}/extensions/${extension}`,
    })
  }
  return allContent
}
