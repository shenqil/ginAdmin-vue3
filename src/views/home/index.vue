<template>
    home
  
    {{doubleCount}} /
   {{obj.count}}/
   {{storeCount}}
</template>

<script lang="ts">
import {computed,reactive, onMounted} from 'vue'
import {useStore} from 'vuex'

export default {
  setup () {
    const store = useStore()

    const obj = reactive({
      count:1,
      msg:2
    })
    const doubleCount = computed(()=>obj.count*2)
    const storeCount = computed(():number=>store.getters['demo/doubleCount'])

    onMounted(()=>{
      setInterval(()=>{
        obj.count++
        store.dispatch('demo/asyncChangeCount')
      },2000)
    })

    return {
      obj,
      doubleCount,
      storeCount
    }
  }
}
</script>