/**
 * Minimal browser-friendly replacement for REPLOutputFormatter.
 * Delegates formatted messages to a callback so the UI can render them.
 *
 * @typedef {'system'|'error'|'warning'|'stdout'} LineKind
 */

export default class WebOutputFormatter {
	addLine: (line: {kind: string, text: string}) => void;
	currentOutputType: string | null;

	/**
	 * @param {(line:{kind:LineKind,text:string})=>void} addLine
	 */
	constructor(addLine: (line: {kind: string, text: string}) => void) {
		this.addLine = addLine;
		this.currentOutputType = null;
	}

	outputType(type: string) {
		this.currentOutputType = type;
	}

	waiting(msg: string) {
		this.addLine({ kind: "system", text: `⏳ ${msg}` });
	}

	doneWaiting() {
		// no spinner needed – the UI could implement one if desired
	}

	systemLine(...msgs: string[]) {
		this.addLine({ kind: "system", text: msgs.join(" ") });
	}

	errorLine(...msgs: string[]) {
		this.addLine({ kind: "error", text: msgs.join(" ") });
	}

	warningLine(...msgs: string[]) {
		this.addLine({ kind: "warning", text: msgs.join(" ") });
	}

	printHorizontalLine() {
		this.addLine({ kind: "system", text: "─".repeat(40) });
	}

	stdout(msg: string) {
		this.addLine({ kind: "stdout", text: msg });
	}
}
