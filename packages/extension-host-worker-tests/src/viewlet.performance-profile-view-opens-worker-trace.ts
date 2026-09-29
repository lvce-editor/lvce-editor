import type {Test} from '@lvce-editor/test-with-playwright';

export const name = 'viewlet.performance-profile-view-opens-worker-trace';

export const test: Test = async ({Command, expect, FileSystem, Locator: locate}) => {
	const directory = await FileSystem.getTmpDir();
	const uri = `${directory}/.org.chromium.Chromium.recording`;
	await FileSystem.writeFile(
		uri,
		JSON.stringify({
			traceEvents: [
				{
					args: {name: 'LVCE Editor'}, name: 'process_name', ph: 'M', pid: 10,
				},
				{
					args: {name: 'DedicatedWorker thread'}, name: 'thread_name', ph: 'M', pid: 10, tid: 22,
				},
				{
					args: {data: {url: 'lvce-oss://-/extensions/builtin.eslint/dist/eslintEvaluationWorkerMain.js'}},
					cat: 'devtools.timeline', dur: 3500, name: 'Lint workspace', ph: 'X', pid: 10, tid: 22, ts: 1000,
				},
			],
		}),
	);
	await Command.execute('Main.openInput', {
		editorInput: {type: 'webview', uri, providerId: 'builtin.performance-profile-view'},
		focus: true,
		args: [{opener: 'builtin.performance-profile-view'}],
	});

	await expect(locate('.PerformanceProfileView')).toBeVisible();
	await expect(locate('.PerformanceProfileSummary')).toContainText('1 events');
	await expect(locate('.PerformanceProfileEventName')).toHaveText('Lint workspace');
	await expect(locate('.PerformanceProfileEventDetail')).toContainText('eslintEvaluationWorkerMain.js');
	await expect(locate('.PerformanceProfileEventDuration')).toHaveText('3.50 ms');
	await expect(locate('.PerformanceProfileFilter')).toBeVisible();
};
