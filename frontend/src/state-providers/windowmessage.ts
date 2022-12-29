//https://graphite.rs/contribute/
// git clone https://github.com/GraphiteEditor/Graphite.git
// npm i
//create symlink of this file into Graphite\frontend\src\state-providers
//edit  Graphite\frontend\src\App.vue
//add line: import { createMyscadaState } from "./state-providers/myscada";
//search for: "panels: createPanelsState(editor),"
//add line: myscada: createMyscadaState(editor),
// npm run start

import { type Editor } from "@/wasm-communication/editor";
import { UpdateDocumentRulers } from "@/wasm-communication/messages";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function createWindowmessage(editor: Editor) {
	function subscribeDocumentPanel(): void {
		//listening for incomming message
		//here we get file to open
		window.addEventListener(
			"message",
			async (event) => {
				//if (event.origin !== "http://example.org:8080") return;
				try {
					let data = JSON.parse(event.data);
					if (data.type === "file") {
						await editor.instance.openDocumentFile(data.filename, data.file);
					} else if (data.type === "saveDocument") {
						editor.instance.saveDocument();
					} else if (data.type === "exportGraphiteDocument") {
						editor.instance.exportDocument();
					}
				} catch (e) {}
			},
			false
		);

		//procistime databazi se zobrazenymi daty
		let openRequest = indexedDB.deleteDatabase("graphite");
		openRequest.onupgradeneeded = function () {};

		openRequest.onerror = function () {};

		openRequest.onsuccess = function () {
			let db = openRequest.result;
		};

		//light style sheet
		let urlParams = new URLSearchParams(window.location.search);
		if (urlParams.get("theme") === "light") {
			var r: any = document.querySelector(":root");

			r.style.setProperty("--color-0-black", "#fff");
			r.style.setProperty("--color-0-black-rgb", 255, 255, 255);
			//r.style.setProperty("--color-1-nearblack", "#eee");
			//r.style.setProperty("--color-1-nearblack-rgb", 238, 238, 238);
			r.style.setProperty("--color-1-nearblack", "#fff");
			r.style.setProperty("--color-1-nearblack-rgb", 255, 255, 255);
			r.style.setProperty("--color-2-mildblack", "#ddd");
			r.style.setProperty("--color-2-mildblack-rgb", 221, 221, 221);

			//r.style.setProperty("--color-3-darkgray", "#ccc");
			//r.style.setProperty("--color-3-darkgray-rgb", 204, 204, 204);
			r.style.setProperty("--color-3-darkgray", "#eee");
			r.style.setProperty("--color-3-darkgray-rgb", 238, 238, 238);
			r.style.setProperty("--color-4-dimgray", "#bbb");
			r.style.setProperty("--color-4-dimgray-rgb", 187, 187, 187);
			r.style.setProperty("--color-5-dullgray", "#aaa");
			r.style.setProperty("--color-5-dullgray-rgb", 170, 170, 170);
			r.style.setProperty("--color-6-lowergray", "#999999");
			r.style.setProperty("--color-6-lowergray-rgb", 153, 153, 153);
			r.style.setProperty("--color-7-middlegray", "#929292");
			r.style.setProperty("--color-7-middlegray-rgb", 146, 146, 146);
			r.style.setProperty("--color-8-uppergray", "#777");
			r.style.setProperty("--color-8-uppergray-rgb", 119, 119, 119);
			r.style.setProperty("--color-9-palegray", "#666");
			r.style.setProperty("--color-9-palegray-rgb", 102, 102, 102);
			r.style.setProperty("--color-a-softgray", "#555");
			r.style.setProperty("--color-a-softgray-rgb", 85, 85, 85);
			r.style.setProperty("--color-b-lightgray", "#444");
			r.style.setProperty("--color-b-lightgray-rgb", 68, 68, 68);
			r.style.setProperty("--color-c-brightgray", "#333");
			r.style.setProperty("--color-c-brightgray-rgb", 51, 51, 51);
			r.style.setProperty("--color-d-mildwhite", "#222");
			r.style.setProperty("--color-d-mildwhite-rgb", 34, 34, 34);
			r.style.setProperty("--color-e-nearwhite", "#111");
			r.style.setProperty("--color-e-nearwhite-rgb", 17, 17, 17);
			r.style.setProperty("--color-f-white", " #000");
			r.style.setProperty("--color-f-white-rgb", 0, 0, 0);
		}

		setTimeout(async () => {
			//skryjeme horni menu a tab
			let tb: any = document.getElementsByClassName("title-bar");
			//tb[0].style.display = "none";
			let tab: any = document.getElementsByClassName("tab-bar");
			//tab[0].style.display = "none";

			//get document id
			//let tabactive: any = document.getElementsByClassName("tab active");
			//documentId = BigInt(tabactive[0].title.split(" ")[2]);
			//console.log(documentId);

			window.parent.postMessage(JSON.stringify({ type: "inited" }), "*");
		}, 0);

		//positions
		editor.subscriptions.subscribeJsMessage(UpdateDocumentRulers, (updateDocumentRulers) => {
			//await nextTick();
			let canvas = document.getElementsByClassName("canvas");
			//let width = canvas[0].clientWidth;
			//let height = canvas[0].clientHeight;
			let rect = canvas[0].getBoundingClientRect();
			const { origin, spacing, interval } = updateDocumentRulers;
			window.parent.postMessage(
				JSON.stringify({ type: "position", svg: { x: origin.x, y: origin.y, zoom: spacing / interval }, canvas: { x: rect.left, y: rect.top, w: rect.width, h: rect.height } }),
				"*"
			);
		});
	}

	subscribeDocumentPanel();

	return {};
}
export type windowmessage = ReturnType<typeof createWindowmessage>;
