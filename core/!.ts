
declare const DEBUG: boolean;
declare const ELECTRON: boolean;
declare const TAURI: boolean;
declare const Moduless: { getRunningFunctionName(): string; }

declare namespace Tauri
{
	export const fs: typeof import("@tauri-apps/api").fs;
	export const cli: typeof import("@tauri-apps/api").cli;
	export const clipboard: typeof import("@tauri-apps/api").clipboard;
	export const dialog: typeof import("@tauri-apps/api").dialog;
	export const event: typeof import("@tauri-apps/api").event;
	export const globalShortcut: typeof import("@tauri-apps/api").globalShortcut;
	export const http: typeof import("@tauri-apps/api").http;
	export const invoke: typeof import("@tauri-apps/api").invoke;
	export const notification: typeof import("@tauri-apps/api").notification;
	export const os: typeof import("@tauri-apps/api").os;
	export const path: typeof import("@tauri-apps/api").path;
	export const process: typeof import("@tauri-apps/api").process;
	export const shell: typeof import("@tauri-apps/api").shell;
	export const tauri: typeof import("@tauri-apps/api").tauri;
	export const updater: typeof import("@tauri-apps/api").updater;
	export const window: typeof import("@tauri-apps/api").window;
}

declare namespace Electron
{
	export const fs: typeof import("fs");
	export const path: typeof import("path");
}

// The globalThis value isn't available in Safari, so a polyfill is necessary:
if (typeof globalThis === "undefined")
	(window as any).globalThis = window;

// If the DEBUG flag is undefined, that means that the executing code
// has not passed through terser, and so we are either running in a
// cover function, or in one of the hosts in debug mode. In this case,
// we set the compilation constants explicitly at runtime.
if (typeof DEBUG === "undefined")
	Object.assign(globalThis, { DEBUG: true });

if (typeof ELECTRON === "undefined")
	Object.assign(globalThis, { ELECTRON: typeof screen + typeof require === "objectfunction" });

if (typeof TAURI === "undefined")
	Object.assign(globalThis, { TAURI: typeof window !== "undefined" && typeof (window as any).__TAURI__ !== "undefined" });

if (TAURI)
{
	const g = globalThis as any;
	g.Tauri = g.__TAURI__;
}
else if (ELECTRON)
{
	const g = globalThis as any;
	g.Electron = Object.freeze({
		fs: require("fs"),
		path: require("path")
	});
}

const isPwa = 
	"standalone" in navigator ||
	window.matchMedia("(display-mode: standalone)").matches;

const isTouch =  matchMedia("(pointer:coarse)").matches;

const hot = new Hot();
