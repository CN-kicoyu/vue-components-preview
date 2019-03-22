<template>
  <vue-ui-frames-demo-page :menus="menus" :base="base"></vue-ui-frames-demo-page>
</template>

<script>
export default {
  props: {
    config: Object,
    base: String
  },
  computed: {
    menus () {
      return this.config.menus
    }
  }
}
</script>
