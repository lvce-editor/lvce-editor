const quickPickItemProps = {
  role: 'option',
  className: 'QuickPickItem',
}

const quickPickLabelProps = {
  className: 'QuickPickItemLabel',
}

export const render = (state) => {
  const { items } = state
  const virtualDom = []
  for (const item of items) {
    virtualDom.push({
      type: 'div',
      props: {
        ...quickPickItemProps,
        'aria-posinset': item.posInSet,
        'aria-setsize': item.setSize,
        children: [
          {
            type: 'div',
            className: 'QuickPickItemLabel',
            children: [
              {
                type: 'text',
                value: item.label,
              },
            ],
          },
        ],
      },
    })
  }
}
