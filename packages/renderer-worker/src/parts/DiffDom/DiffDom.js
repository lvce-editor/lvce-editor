const diffProps = (oldProps, newProps) => {}

const diffNodes = (oldNodes, newNodes) => {}

export const diffDom = (oldDom, newDom) => {
  const oldChildCount = oldDom.children.length
  const newChildCount = newDom.children.length
  if (oldChildCount < newChildCount) {
    // add some nodes
  } else if (oldChildCount === newChildCount) {
    // diff the nodes
  } else {
    // remove some nodes
    return [
      {
        method: 'remove',
        params: {
          count: oldChildCount - newChildCount,
        },
      },
    ]
  }
}
