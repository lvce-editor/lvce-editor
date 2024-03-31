import * as AssetDir from '../AssetDir/AssetDir.ts'

export const loadBabelParser = () => {
  const url = `${AssetDir.assetDir}/js/babel-parser.ts`
  return import(url)
}
