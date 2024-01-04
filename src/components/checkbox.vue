<template>
  <input
    ref="checkbox"
    type="checkbox"
    :checked="checked && !indeterminate"
    v-bind="$attrs"
    v-on="$listeners"
  />
</template>

<script>
export default {
  name: "checkbox",
  props:{
    checked: {
      type: Boolean,
      default: false
    },
    indeterminate:{
      type: Boolean,
      default: false
    }
  },
  watch:{
    indeterminate:{
      handler(nVal){
        this.$nextTick(()=>{
          this.$refs.checkbox.indeterminate = nVal
        })
      },
      immediate: true
    }
  }
}
</script>

<style scoped>

</style>
