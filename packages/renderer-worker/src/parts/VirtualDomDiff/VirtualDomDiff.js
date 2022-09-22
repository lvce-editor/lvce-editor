import * as VirtualDomDiffType from '../VirtualDomDiffType/VirtualDomDiffType.js'
import { parse } from '../VirtualDomParser/VirtualDomParser.js'

const patchProps = (changes, i, oldProps, newProps) => {
  for (const key in newProps) {
    const next = newProps[key]
    const prev = oldProps[key]
    if (next !== prev) {
      return changes.push({
        index: i,
        operation: VirtualDomDiffType.AttributeSet,
        key,
        value: next,
      })
    }
  }
  for (const key in oldProps) {
    if (!(key in newProps)) {
      changes.push({
        index: i,
        operation: VirtualDomDiffType.AttributeRemove,
        key,
      })
    }
  }
}

const getParentNodeIndex = (dom, startIndex) => {
  for (let i = startIndex; i > 0; i--) {
    const node = oldDom[i]
    total -= node.childCount
    total++
    if (total < 0) {
      total += node.childCount
      break
    }
  }
}

const unMountChildren = (changes, commonLength, oldLength, oldDom) => {
  if (commonLength === 0) {
    changes.push({
      index: commonLength,
      operation: VirtualDomDiffType.ElementRemoveAll,
    })
  } else {
    let total = 0
    commonLength
    for (let i = commonLength - 1; i > 0; i--) {
      const node = oldDom[i]
      console.log({ node, total })
      total -= node.childCount
      total++
      if (total < 0) {
        total += node.childCount
        break
      }
    }
    changes.push({
      index: commonLength,
      operation: VirtualDomDiffType.ElementsRemove,
      keepCount: total,
    })
  }
}

const mountChildren = (changes, newDom, commonLength, count) => {
  const index = 0
  let insertIndex = -1
  for (let i = 0; i < changes.length; i++) {
    const change = changes[i]
    console.log({ changes, change })
    if (change.index > index) {
      insertIndex = i
      break
    }
  }
  changes.splice(insertIndex, 0, {
    index,
    operation: VirtualDomDiffType.ElementsAdd,
    newDom: newDom.slice(commonLength, commonLength + count),
  })
}

// export const diff = (oldDom, newDom) => {
//   const changes = []
//   const oldLength = oldDom.length
//   const newLength = newDom.length
//   const commonLength = Math.min(oldLength, newLength)
//   let oldIndex = 0
//   let newIndex = 0
//   while (oldIndex < commonLength) {
//     const oldNode = oldDom[oldIndex]
//     const newNode = newDom[newIndex]
//     if (oldNode.childCount !== newNode.childCount) {
//       if (newNode.childCount === 0) {
//         changes.push({
//           index: oldIndex,
//           operation: VirtualDomDiffType.ElementRemoveAll,
//         })
//       } else if (oldNode.childCount > newNode.childCount) {
//         const keepCount = newNode.childCount
//         keepCount
//         // TODO diff children
//         console.log('diff children')
//         oldNode
//         newNode
//       }
//     }
//     oldIndex += oldNode.childCount + 1
//     newIndex += newNode.childCount + 1
//     patchProps(changes, oldIndex, oldNode.props, newNode.props)
//   }
//   // if (oldLength > newLength) {
//   //   unMountChildren(changes, commonLength, oldLength, oldDom)
//   // } else if (newLength > oldLength) {
//   //   mountChildren(changes, newDom, commonLength, newLength - oldLength)
//   // }
//   return changes
// }

const diffChildren = (changes) => {}

export const diff = (oldDom, newDom) => {
  const changes = []
  const oldMax = oldDom.length - 1
  const newMax = newDom.length - 1
  let oldStack = []
  let newStack = []
  let oldNode
  let newNode
  let oldIndex = oldMax
  let newIndex = newMax

  oldMax
  newMax
  while (oldIndex >= 0 && newIndex >= 0) {
    oldNode = oldDom[oldIndex]
    newNode = newDom[newIndex]
    oldNode
    newNode
    if (oldNode.childCount > 0) {
      oldStack = oldStack.slice(oldNode.childCount)
      oldStack
    }
    if (newNode.childCount > 0) {
      const children = newStack
      while (oldIndex-- >= 0) {
        oldNode = oldDom[oldIndex]
        oldStack.push(oldNode)
        if (oldNode.childCount >= 0) {
          break
        }
        // oldNode
      }
      oldIndex
      newIndex
      // while(oldNode.childCount )
      newStack
      oldStack
      newStack = newStack.slice(newNode.childCount)
      newStack
    }
    if (oldNode.childCount > newNode.childCount) {
      console.log('greater')
    } else if (newNode.childCount > oldNode.childCount) {
      console.log('remove elements')
    }
    oldStack
    newStack
    oldStack.unshift(oldNode)
    newStack.unshift(newNode)
    oldIndex--
    newIndex--
    oldIndex
    newIndex
  }

  oldIndex
  newIndex

  // const changes = []
  // const oldLength = oldDom.length
  // const newLength = newDom.length
  // const commonLength = Math.min(oldLength, newLength)
  // let oldIndex = 0
  // let newIndex = 0
  // while (oldIndex < commonLength) {
  //   const oldNode = oldDom[oldIndex]
  //   const newNode = newDom[newIndex]
  //   if (oldNode.childCount !== newNode.childCount) {
  //     if (newNode.childCount === 0) {
  //       changes.push({
  //         index: oldIndex,
  //         operation: VirtualDomDiffType.ElementRemoveAll,
  //       })
  //     } else if (oldNode.childCount > newNode.childCount) {
  //       const keepCount = newNode.childCount
  //       keepCount
  //       // TODO diff children
  //       console.log('diff children')
  //       oldNode
  //       newNode
  //     }
  //   }
  //   oldIndex += oldNode.childCount + 1
  //   newIndex += newNode.childCount + 1
  //   patchProps(changes, oldIndex, oldNode.props, newNode.props)
  // }
  // if (oldLength > newLength) {
  //   unMountChildren(changes, commonLength, oldLength, oldDom)
  // } else if (newLength > oldLength) {
  //   mountChildren(changes, newDom, commonLength, newLength - oldLength)
  // }
  return changes
}

const html = (string) => {
  return parse(string)
}

// const oldDom = html(`
// <div id="QuickPickItems">
//   <div class="QuickPickItem">
//     <i class="icon"></i>
//     <div class="Label">1</div>
//   </div>
//   <div class="QuickPickItem">
//     <i class="icon"></i>
//     <div class="Label">2</div>
//   </div>
//   <div class="QuickPickItem">
//     <i class="icon"></i>
//     <div class="Label">3</div>
//   </div>
// </div>`)
// const newDom = html(`<div id="QuickPickItems"></div>`)

const oldDom = html(`<root><div></div><div></div></root>`)
const newDom = html(`<root><div></div></root>`)
const changes = diff(oldDom, newDom) //?
