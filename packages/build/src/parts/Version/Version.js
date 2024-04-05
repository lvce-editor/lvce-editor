import * as Tag from '../Tag/Tag.js'

export const getVersion = async () => {
  const tag = await Tag.getGitTag()
  return tag
}
