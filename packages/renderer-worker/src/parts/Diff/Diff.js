// Based on https://johnresig.com/projects/javascript-diff-algorithm/ by John Resig (License MIT)

/**
 *
 * @param {string[]} linesA
 * @param {string[]} linesB
 * @returns
 */
export const diff = (linesA, linesB) => {
  const changes = []
  let sequenceStart = 0
  let sequenceEnd = 0
  // const commonLength = Math.min(stringA.length, stringB.length)
  // let prefixLength = 0
  // let suffixLength = 0
  // for (let i = 0; i < commonLength; i++) {
  //   if (stringA[i] === stringB[i]) {
  //     prefixLength++
  //   } else {
  //     break
  //   }
  // }
  // for (let i = 0; i < commonLength; i++) {
  //   if (stringA[stringA.length - i] === stringB[stringB.length - i]) {
  //     suffixLength++
  //   } else {
  //     break
  //   }
  // }

  // if (prefixLength !== commonLength) {
  //   changes.push(/* change */ 1, /* length */ stringB.length - suffixLength)
  // }

  // console.log({ prefixLength, suffixLength })

  return changes
}
