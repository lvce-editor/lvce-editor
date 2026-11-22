import * as Copy from '../Copy/Copy.ts'
import * as FiraCodePath from '../FiraCodePath/FiraCodePath.ts'

export const copyFiraCode = async (to: string) => {
  await Copy.copy({ from: FiraCodePath.firaCodeFilesPath, to: `${to}/files` })
  await Copy.copyFile({ from: `${FiraCodePath.firaCodePath}/LICENSE`, to: `${to}/LICENSE` })
}
