import { expect, test } from '@jest/globals'
import * as ComponentState from '../src/parts/ViewletTerminals/ViewletTerminalsComponentState.js'

const createState = () => ({
	activeTerminalUids: [11],
	childUid: 11,
	childUids: [11],
	selectedIndex: 0,
	tabs: [{ icon: 'terminal-bash', label: 'bash', terminalUids: [11], uid: 11 }],
	uid: 1,
})

test.each([null, [], 'invalid', 42])('rejects non-object state %p', (state) => {
	expect(() => ComponentState.setComponentState(createState(), state)).toThrow('Terminals state must be an object')
})

test('returns the live terminal state for inspection', () => {
	const state = createState()

	expect(ComponentState.getComponentState(state)).toBe(state)
})

test('updates tab labels while preserving live terminal state', () => {
	const currentState = createState()
	const nextState = ComponentState.setComponentState(currentState, {
		...currentState,
		tabs: [{ ...currentState.tabs[0], label: 'build output' }],
	})

	expect(nextState.tabs[0].label).toBe('build output')
	expect(nextState.activeTerminalUids).toBe(currentState.activeTerminalUids)
	expect(nextState.childUids).toBe(currentState.childUids)
	expect(nextState.childUid).toBe(currentState.childUid)
	expect(nextState.selectedIndex).toBe(currentState.selectedIndex)
})

test('rejects changing terminal identities', () => {
	const currentState = createState()

	expect(() => ComponentState.setComponentState(currentState, { ...currentState, uid: 2 })).toThrow('Terminals state uid must remain 1')
	expect(() => ComponentState.setComponentState(currentState, { ...currentState, tabs: [{ ...currentState.tabs[0], uid: 12 }] })).toThrow(
		'Terminals tabs must keep their current identities',
	)
})

test('rejects changing split membership', () => {
	const currentState = createState()

	expect(
		() =>
			ComponentState.setComponentState(currentState, {
				...currentState,
				tabs: [{ ...currentState.tabs[0], terminalUids: [11, 12] }],
			}),
	).toThrow('Terminals splits must keep their current identities')
})

test('rejects non-string tab labels', () => {
	const currentState = createState()

	expect(() => ComponentState.setComponentState(currentState, { ...currentState, tabs: [{ ...currentState.tabs[0], label: 42 }] })).toThrow(
		'Terminal tab label must be a string',
	)
})
