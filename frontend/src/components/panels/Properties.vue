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

import { defaultWidgetLayout, patchWidgetLayout, UpdatePropertyPanelOptionsLayout, UpdatePropertyPanelSectionsLayout } from "@/wasm-communication/messages";

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
			patchWidgetLayout(this.propertiesOptionsLayout, updatePropertyPanelOptionsLayout);
			//this.propertiesOptionsLayout = updatePropertyPanelOptionsLayout;
			let processed = false;
			let type = "";
			try {
				let layouty:any=this.propertiesOptionsLayout.layout[0];
				const array = layouty.rowWidgets;
				for (const obj of array) {
					if (obj.props.kind === "TextLabel") {
						type = obj.props.value;
					}
					else if (obj.props.kind === "TextInput") {
						let tab = window.document.getElementById("__myscadaSelectPanelIdForActive");
						let children = tab?.getElementsByClassName("tab");
						if (children && children.length > 1) {
							let action="id";

							if (!children[1].classList.contains("active")){
								action="memoryId"
							}

							let pb = tab?.getElementsByClassName("panel-body");
							if (pb && pb.length > 0) {
								let rect = pb[0].getBoundingClientRect();
								window.parent.postMessage(JSON.stringify({ type: "selection", action: action, id: obj.props.value, element: type, x: rect.x, y: rect.y, w: rect.width, h: rect.height }), "*");
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
			patchWidgetLayout(this.propertiesSectionsLayout, updatePropertyPanelSectionsLayout);
			//this.propertiesSectionsLayout = updatePropertyPanelSectionsLayout;
			//detekce zmeny velikosti kanvasu
			try{
			let pom:any=this.propertiesSectionsLayout;
			let obj:any=pom.layout[0];
			if (obj.layout && obj.layout.length>0){
				if (obj.name==="Artboard"){
					let w=-1;
					let h=-1;
					let x=-1;
					let y=-1;
					for (const item of obj.layout[0].rowWidgets){
						if (item.props.kind==="NumberInput" && x===-1){
							x=item.props.value;
						}
						else if (item.props.kind==="NumberInput" && y===-1){
							y=item.props.value;
						}
					}
					for (const item of obj.layout[1].rowWidgets){
						if (item.props.kind==="NumberInput" && w===-1){
							w=item.props.value;
						}
						else if (item.props.kind==="NumberInput" && h===-1){
							h=item.props.value;
						}
					}
					if (w>=0 && h>=0){
						let data = JSON.stringify({ type: "canvasSize", w: w, h: h, x: x, y: y });
						window.parent.postMessage(data, "*");
					}
				}
			}
			}
			catch (e){}
		});
		
	},
	components: {
		LayoutCol,
		LayoutRow,
		WidgetLayout,
	},
});
</script>
