export const getVisibleE2eTests = (tests: readonly string[], index: number) => {
  const visible: any[] = []
  for (let i = 0; i < tests.length; i++) {
    const test = tests[i]
    visible.push({
      name: test,
      isActive: i === index,
    })
  }
  return visible
}
