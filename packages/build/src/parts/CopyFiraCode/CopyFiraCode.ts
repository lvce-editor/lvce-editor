import { readdir } from 'node:fs/promises'
import * as Copy from '../Copy/Copy.ts'
import * as FiraCodePath from '../FiraCodePath/FiraCodePath.ts'

export const copyFiraCode = async (to: string) => {
  await Copy.copy({ from: FiraCodePath.firaCodeFilesPath, to: `${to}/files` })
  await Copy.copyFile({ from: `${FiraCodePath.firaCodePath}/LICENSE`, to: `${to}/LICENSE` })
  const files = await readdir(FiraCodePath.firaCodePath)
  const cssFiles = files.filter((file) => /^\d+\.css$/.test(file))
  for (const file of cssFiles) {
    await Copy.copyFile({ from: `${FiraCodePath.firaCodePath}/${file}`, to: `${to}/${file}` })
  }
}
