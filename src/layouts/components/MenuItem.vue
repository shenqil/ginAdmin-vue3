<template>
  <div v-if="item.children">
    <a-sub-menu :key="item.id">
      <template #icon> </template>
      <template #title>{{ item.name }}</template>

      <MenuItem v-for="element in item.children" :key="element.router" :item="element" />
    </a-sub-menu>
  </div>

  <div v-else>
    <a-menu-item :key="item.id">
      <template #icon> </template>
      <span>{{ item.name }}</span>
    </a-menu-item>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { IMenuTree } from "../../server/interface";

export default defineComponent({
  name: "MenuItem",
  props: {
    item: {
      type: Object as PropType<IMenuTree>,
      required: true,
    },
  },
});
</script>
