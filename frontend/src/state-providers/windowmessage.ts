//https://graphite.rs/contribute/
// git clone https://github.com/GraphiteEditor/Graphite.git
// npm i
//create symlink of this file into Graphite\frontend\src\state-providers
//edit  Graphite\frontend\src\App.vue
//add line: import { createMyscadaState } from "./state-providers/myscada";
//search for: "panels: createPanelsState(editor),"
//add line: myscada: createMyscadaState(editor),
// npm run start

import { nextTick, reactive, readonly } from "vue";

import { type Editor } from "@/wasm-communication/editor";
import { UpdateDocumentRulers, UpdatePropertyPanelOptionsLayout, UpdatePropertyPanelSectionsLayout } from "@/wasm-communication/messages";

//import DocumentComponent from "@/components/panels/Document.vue";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function createMyscadaState(editor: Editor) {
	const state = reactive({
		//documentPanel: DocumentComponent,
	});

	// We use `any` instead of `typeof DocumentComponent` as a workaround for the fact that calling this function with the `this` argument from within `Document.vue` isn't a compatible type
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function registerPanel(type: string, panelComponent: any): void {
		//	state.documentPanel = panelComponent;
	}

	let documentId: BigInt;

	function subscribeDocumentPanel(): void {
		window.addEventListener(
			"message",
			async (event) => {
				//if (event.origin !== "http://example.org:8080") return;
				try {
					let data = JSON.parse(event.data);
					if (data.command === "file") {
						await editor.instance.openDocumentFile(data.filename, data.file);
					} else if (data.command === "save") {
						//editor.instance.triggerAutoSave();
					}
				} catch (e) {}
			},
			false
		);

		//procistime databazi se zobrazenymi daty
		let openRequest = indexedDB.deleteDatabase("graphite");
		openRequest.onupgradeneeded = function () {
			// triggers if the client had no database
			// ...perform initialization...
		};

		openRequest.onerror = function () {
			console.error("Error", openRequest.error);
		};

		openRequest.onsuccess = function () {
			let db = openRequest.result;
		};

		setTimeout(async () => {
			//skryjeme horni menu a tab
			let tb: any = document.getElementsByClassName("title-bar");
			tb[0].style.display = "none";
			let tab: any = document.getElementsByClassName("tab-bar");
			tab[0].style.display = "none";

			//$.artboard_message_handler.artboards_graphene_document.root.data.Folder.layers[0].transform.matrix2
			await editor.instance.openDocumentFile(
				"",
				'{"graphene_document":{"root":{"visible":true,"name":null,"data":{"Folder":{"next_assignment_id":166485429398608272,"layer_ids":[166485429398608271],"layers":[{"visible":true,"name":null,"data":{"Text":{"text":"AHOJ","path_style":{"stroke":null,"fill":{"Solid":{"red":0.0,"green":0.0,"blue":0.0,"alpha":1.0}}},"size":24.0,"line_width":null,"font":{"fontFamily":"Merriweather","fontStyle":"Normal (400)"}}},"transform":{"matrix2":[2.430855772348653,0.0,0.0,2.430855772348653],"translation":[510.12454594438424,479.71480651928584]},"pivot":[0.5,0.5],"blend_mode":"Normal","opacity":1.0}]}},"transform":{"matrix2":[0.4113777589666772,0.0,0.0,0.4113777589666772],"translation":[3.7461135990211005,109.85601015799429]},"pivot":[0.5,0.5],"blend_mode":"Normal","opacity":1.0}},"saved_document_identifier":0,"auto_saved_document_identifier":0,"name":"Untitled Document","version":"0.0.15","document_mode":"DesignMode","view_mode":"Normal","snapping_enabled":true,"overlays_visible":true,"layer_metadata":[[[],{"selected":false,"expanded":true}],[[166485429398608271],{"selected":true,"expanded":false}]],"layer_range_selection_reference":[166485429398608271],"navigation_handler":{"pan":[-960.0,-540.0],"panning":false,"snap_tilt":false,"snap_tilt_released":false,"tilt":0.0,"tilting":false,"zoom":0.4113777589666772,"zooming":false,"snap_zoom":false,"mouse_position":[0.0,0.0]},"artboard_message_handler":{"artboards_graphene_document":{"root":{"visible":true,"name":null,"data":{"Folder":{"next_assignment_id":7877742131556412020,"layer_ids":[7877742131556412019],"layers":[{"visible":true,"name":null,"data":{"Shape":{"shape":{"elements":[{"points":[{"position":[0.0,0.0],"manipulator_type":"Anchor"},null,null]},{"points":[{"position":[0.0,1.0],"manipulator_type":"Anchor"},null,null]},{"points":[{"position":[1.0,1.0],"manipulator_type":"Anchor"},null,null]},{"points":[{"position":[1.0,0.0],"manipulator_type":"Anchor"},null,null]},{"points":[null,null,null]}],"element_ids":[1,2,3,4,5],"next_id":5},"style":{"stroke":null,"fill":{"Solid":{"red":1.0,"green":1.0,"blue":1.0,"alpha":1.0}}},"render_index":1}},"transform":{"matrix2":[1920.0,0.0,-0.0,1080.0],"translation":[0.0,0.0]},"pivot":[0.5,0.5],"blend_mode":"Normal","opacity":1.0}]}},"transform":{"matrix2":[0.4113777589666772,0.0,0.0,0.4113777589666772],"translation":[3.7461135990211005,109.85601015799429]},"pivot":[0.5,0.5],"blend_mode":"Normal","opacity":1.0}},"artboard_ids":[7877742131556412019]},"properties_panel_message_handler":{"active_selection":[[166485429398608271],"Artwork"]}}'
			);

			//try {
			let tabactive: any = document.getElementsByClassName("tab active");
			documentId = BigInt(tabactive[0].title.split(" ")[2]);
			//editor.instance.closeDocumentWithConfirmation(BigInt(id));
			console.log(documentId);

			//} catch (e) {}
		}, 0);

		//positions
		editor.subscriptions.subscribeJsMessage(UpdateDocumentRulers, async (updateDocumentRulers) => {
			await nextTick();
			let canvas = document.getElementsByClassName("canvas");
			//let width = canvas[0].clientWidth;
			//let height = canvas[0].clientHeight;
			let rect = canvas[0].getBoundingClientRect();
			const { origin, spacing, interval } = updateDocumentRulers;
			//console.log(origin, spacing / interval);
			window.parent.postMessage(
				JSON.stringify({ type: "position", svg: { x: origin.x, y: origin.y, zoom: spacing / interval }, canvas: { x: rect.left, y: rect.top, w: rect.width, h: rect.height } }),
				"*"
			);
		});
	}

	subscribeDocumentPanel();

	return {
		state: readonly(state) as typeof state,
		registerPanel,
	};
}
export type MyscadaState = ReturnType<typeof createMyscadaState>;
