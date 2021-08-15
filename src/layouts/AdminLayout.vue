<template>
    admin
    <router-view/>
</template>

<script lang="ts">
import { ref, reactive } from 'vue'

export default {
  setup() {
    const readersNumber = ref(0)
    const book = reactive({ title: 'Vue 3 Guide' })

    // expose to template
    return {
      readersNumber,
      book
    }
  }
}
</script>