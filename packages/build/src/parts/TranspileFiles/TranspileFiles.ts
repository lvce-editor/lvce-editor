import { readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const transpileFile = (typescript, content) => {
  const result = typescript.transpileModule(content, {
    compilerOptions: {
      target: 'esnext',
    },
  })
  return result.outputText
}

export const transpileFiles = async (folder) => {
  const typescript = await import('typescript')
  const dirents = await readdir(folder)
  for (const dirent of dirents) {
    if (dirent.endsWith('.ts')) {
      const content = await readFile(join(folder, dirent), 'utf-8')
      const js = transpileFile(typescript, content)
      await writeFile(join(folder, dirent.slice(0, -2) + 'js'), js)
    }
  }
  for (const dirent of dirents) {
    if (dirent.endsWith('.ts')) {
      await rm(join(folder, dirent))
    }
  }
}
