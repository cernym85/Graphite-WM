<template>
	<div
		class="layout-row"
		:class="{ 'scrollable-x': scrollableX, 'scrollable-y': scrollableY }"
		:data-scrollable-x="scrollableX || undefined"
		:data-scrollable-y="scrollableY || undefined"
		:title="tooltip"
	>
		<slot></slot>
	</div>
</template>

<style lang="scss">
.layout-row {
	display: flex;
	flex-direction: row;
	flex-grow: 1;

	.spacer {
		flex: 1 1 100%;
	}
}
</style>

<script lang="ts">
import { defineComponent, type PropType } from "vue";

export default defineComponent({
	props: {
		scrollableX: { type: Boolean as PropType<boolean>, default: false },
		scrollableY: { type: Boolean as PropType<boolean>, default: false },
		tooltip: { type: String as PropType<string | undefined>, required: false },
	},
});
</script>
