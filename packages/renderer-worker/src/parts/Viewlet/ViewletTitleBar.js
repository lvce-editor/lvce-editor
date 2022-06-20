import * as TitleBarMenuBar from '../TitleBarMenuBar/TitleBarMenuBar.js'
import * as RendererProcess from '../RendererProcess/RendererProcess.js'

export const name = 'TitleBar'

export const create = () => {
  return {
    disposed: false,
    titleBarEntries: [],
  }
}

export const loadContent = async (state) => {
  const titleBarEntries = await TitleBarMenuBar.getEntries()
  return {
    ...state,
    titleBarEntries,
  }
}

export const contentLoaded = async (state) => {
  await RendererProcess.invoke(
    /* Viewlet.send */ 3024,
    /* id */ 'TitleBar',
    /* method */ 'menuSetEntries',
    /* titleBarEntries */ state.titleBarEntries
  )
}

export const focus = async () => {
  await TitleBarMenuBar.focus()
}

export const dispose = (state) => {
  return {
    ...state,
    disposed: true,
  }
}

export const resize = (state, dimensions) => {
  return {
    newState: {
      ...state,
      ...dimensions,
    },
    commands: [],
  }
}

export const hasFunctionalRender = true

const to$TitleBarItem = (titleBarEntry) => {
  return {
    component: 'li',
    props: {
      class: 'TitleBarTopLevelEntry',
      tabIndex: -1,
      ariaHasPopup: true,
      ariaExpanded: false,
      role: 'menuitem',
      id: `MenuItem-${titleBarEntry.id}`,
    },
    children: [
      {
        component: 'text',
        props: {
          text: titleBarEntry.name,
        },
      },
    ],
  }
}

export const render = (oldState, newState) => {
  console.log({ newState })
  return [
    {
      component: 'ul',
      props: {
        id: 'TitleBarMenu',
        role: 'menubar',
      },
      children: newState.titleBarEntries.map(to$TitleBarItem),
    },
  ]
}
