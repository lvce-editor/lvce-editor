import type { Test } from '@lvce-editor/test-with-playwright'

interface ComponentInfo {
	readonly editable: boolean
	readonly moduleId: string
	readonly uid: number
}

export const name = 'viewlet.terminals-component-state'

export const test: Test = async ({ Command, Editor, expect, Locator, Main }) => {
	await Command.execute('Layout.showPanel', 'Terminals')
	const terminalTabLabel = Locator('.TerminalTabLabel')
	await expect(terminalTabLabel).toBeVisible()

	const components = (await Command.execute('ComponentState.getComponents')) as readonly ComponentInfo[]
	const component = components.find((item) => item.moduleId === 'Terminals')
	if (!component?.editable) {
		throw new Error(`Expected an editable Terminals component, got ${JSON.stringify(components)}`)
	}

	const state = (await Command.execute('ComponentState.getState', component.uid)) as {
		readonly activeTerminalUids: readonly number[]
		readonly childUids: readonly number[]
		readonly selectedIndex: number
		readonly tabs: readonly { readonly label: string; readonly terminalUids: readonly number[]; readonly uid: number }[]
		readonly uid: number
	}
	if (state.uid !== component.uid || state.tabs.length === 0) {
		throw new Error(`Expected current terminal tab state, got ${JSON.stringify(state)}`)
	}

	const changedState = {
		...state,
		tabs: state.tabs.map((tab, index) => (index === 0 ? { ...tab, label: 'build output' } : tab)),
	}
	await Main.openUri(`live-component-state:///${component.uid}.json`)
	const editorState = JSON.parse(await Editor.getText())
	if (editorState.uid !== component.uid || editorState.tabs[0].label !== state.tabs[0].label) {
		throw new Error(`Expected readable terminal state JSON, got ${JSON.stringify(editorState)}`)
	}
	await Command.execute('ComponentState.setState', component.uid, changedState)
	await expect(terminalTabLabel).toHaveText('build output')

	const updatedState = await Command.execute('ComponentState.getState', component.uid)
	if (updatedState.tabs[0].label !== 'build output') {
		throw new Error(`Expected edited terminal label in live state, got ${JSON.stringify(updatedState.tabs[0].label)}`)
	}
	if (
		updatedState.activeTerminalUids !== state.activeTerminalUids &&
		JSON.stringify(updatedState.activeTerminalUids) !== JSON.stringify(state.activeTerminalUids)
	) {
		throw new Error('Expected editing the terminal label to preserve active terminal identities')
	}
	if (JSON.stringify(updatedState.childUids) !== JSON.stringify(state.childUids) || updatedState.selectedIndex !== state.selectedIndex) {
		throw new Error('Expected editing the terminal label to preserve terminal selection and ownership')
	}

	await Main.closeAllEditors()
}
