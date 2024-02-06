export const mergeClassNames = (...classNames) => {
  return classNames.filter(Boolean).join(' ')
}
