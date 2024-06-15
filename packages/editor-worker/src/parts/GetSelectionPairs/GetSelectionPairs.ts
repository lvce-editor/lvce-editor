export const getSelectionPairs = (selections: any, i: number) => {
  const first = selections[i]
  const second = selections[i + 1]
  const third = selections[i + 2]
  const fourth = selections[i + 3]
  if (first > third || (first === third && second >= fourth)) {
    return [third, fourth, first, second, 1]
  }
  return [first, second, third, fourth, 0]
}
