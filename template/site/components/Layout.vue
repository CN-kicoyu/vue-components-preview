<template>
  <vue-ui-frames :config="config" :base="base" :simulators="simulators" active="<$=activeNav$>">
    <router-view></router-view>
  </vue-ui-frames>
</template>

<script>
export default {
  props: {
    config: Object,
    base: String
  }<$ if (platform === 'h5') { $>,
  data () {
    const hashPath = this.$router.mode === "history" ? decodeURIComponent(this.$route.fullPath) : location.hash
    return {
      simulators: [`mobile.html${hashPath}`]
    }
  }<$ } $>
}
</script>
