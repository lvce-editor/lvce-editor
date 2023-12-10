const regexFlags = 'gi'

export const getSearchRegex = (searchString) => {
  return new RegExp(searchString, regexFlags)
}
