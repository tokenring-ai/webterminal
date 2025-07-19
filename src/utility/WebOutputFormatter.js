/**
 * Minimal browser-friendly replacement for REPLOutputFormatter.
 * Delegates formatted messages to a callback so the UI can render them.
 *
 * @typedef {'system'|'error'|'warning'|'stdout'} LineKind
 */

export default class WebOutputFormatter {
	/**
	 * @param {(line:{kind:LineKind,text:string})=>void} addLine
	 */
	constructor(addLine) {
		this.addLine = addLine;
		this.currentOutputType = null;
	}

	outputType(type) {
		this.currentOutputType = type;
	}

	waiting(msg) {
		this.addLine({ kind: "system", text: `⏳ ${msg}` });
	}

	doneWaiting() {
		// no spinner needed – the UI could implement one if desired
	}

	systemLine(...msgs) {
		this.addLine({ kind: "system", text: msgs.join(" ") });
	}

	errorLine(...msgs) {
		this.addLine({ kind: "error", text: msgs.join(" ") });
	}

	warningLine(...msgs) {
		this.addLine({ kind: "warning", text: msgs.join(" ") });
	}

	printHorizontalLine() {
		this.addLine({ kind: "system", text: "─".repeat(40) });
	}

	stdout(msg) {
		this.addLine({ kind: "stdout", text: msg });
	}
}
