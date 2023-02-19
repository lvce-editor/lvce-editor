export const getRipGrepArgs = ({ threads, isCaseSensitive, searchString }) => {
  const ripGrepArgs = ['--smart-case', '--stats', '--json']
  ripGrepArgs.push('--threads', `${threads}`)
  if (isCaseSensitive) {
    ripGrepArgs.push('--case-sensitive')
  } else {
    ripGrepArgs.push('--ignore-case')
  }
  ripGrepArgs.push('--fixed-strings')
  ripGrepArgs.push(searchString)
  ripGrepArgs.push('.')
  return ripGrepArgs
}
