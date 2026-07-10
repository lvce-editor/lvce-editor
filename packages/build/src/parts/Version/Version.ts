import * as Tag from '../Tag/Tag.ts'

export const getVersion = async () => {
  const tag = await Tag.getGitTag()
  return tag
}
