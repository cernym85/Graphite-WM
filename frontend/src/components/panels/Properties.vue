<template>
	<LayoutCol class="properties">
		<LayoutRow class="options-bar">
			<WidgetLayout :layout="propertiesOptionsLayout" />
		</LayoutRow>
		<LayoutRow class="sections" :scrollableY="true">
			<WidgetLayout :layout="propertiesSectionsLayout" />
		</LayoutRow>
	</LayoutCol>
</template>

<style lang="scss">
.properties {
	height: 100%;

	.widget-layout {
		flex: 1 1 100%;
		margin: 0 4px;
	}

	.options-bar {
		height: 32px;
		flex: 0 0 auto;
	}

	.sections {
		flex: 1 1 100%;
	}
}
</style>

<script lang="ts">
import { defineComponent } from "vue";

import { defaultWidgetLayout, UpdatePropertyPanelOptionsLayout, UpdatePropertyPanelSectionsLayout } from "@/wasm-communication/messages";

import LayoutCol from "@/components/layout/LayoutCol.vue";
import LayoutRow from "@/components/layout/LayoutRow.vue";
import WidgetLayout from "@/components/widgets/WidgetLayout.vue";

export default defineComponent({
	inject: ["editor", "dialog"],
	data() {
		return {
			propertiesOptionsLayout: defaultWidgetLayout(),
			propertiesSectionsLayout: defaultWidgetLayout(),
		};
	},
	mounted() {
		this.editor.subscriptions.subscribeJsMessage(UpdatePropertyPanelOptionsLayout, (updatePropertyPanelOptionsLayout) => {
			this.propertiesOptionsLayout = updatePropertyPanelOptionsLayout;
			let processed = false;
			let type = "";
			try {
				const pole: any = updatePropertyPanelOptionsLayout.layout[0];
				let array = pole.rowWidgets;
				for (const obj of array) {
					if (obj.props.kind === "TextLabel") {
						type = obj.props.value;
					}
					else if (obj.props.kind === "TextInput") {
						let tab = window.document.getElementById("__myscadaSelectPanelIdForActive");
						let children = tab?.getElementsByClassName("tab");
						if (children && children.length > 1 && children[1].classList.contains("active")) {
							let pb = tab?.getElementsByClassName("panel-body");
							if (pb && pb.length > 0) {
								let rect = pb[0].getBoundingClientRect();
								window.parent.postMessage(JSON.stringify({ type: "selection", action: "id", id: obj.props.value, element: type, x: rect.x, y: rect.y, w: rect.width, h: rect.height }), "*");
							}
						}
						else {
							window.parent.postMessage(JSON.stringify({ type: "selection", action: "hide" }), "*");
						}
						processed = true;
						break;
					}
				}
			} catch (e) { }

			if (!processed) {
				window.parent.postMessage(JSON.stringify({ type: "selection", action: "hide" }), "*");
			}
		});

		this.editor.subscriptions.subscribeJsMessage(UpdatePropertyPanelSectionsLayout, (updatePropertyPanelSectionsLayout) => {
			this.propertiesSectionsLayout = updatePropertyPanelSectionsLayout;
			/*
			try{
			let obj: any = updatePropertyPanelSectionsLayout;
			if (obj.layout && obj.layout.length>0){
				if (obj.layout[0].name==="Artboard"){
					let w = obj.layout[0].layout[1].rowWidgets[2].value;
					let h = obj.layout[0].layout[1].rowWidgets[4].value;
					window.parent.postMessage(JSON.stringify({ type: "canvasSize", w:w,h:h }), "*");
				}
			}
			}
			catch (e){}
			*/
		});
	},
	components: {
		LayoutCol,
		LayoutRow,
		WidgetLayout,
	},
});
</script>
