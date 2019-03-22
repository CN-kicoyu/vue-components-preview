<template>
  <div>
    <vue-ui-frames-nav-bar v-if="title" :title="title" left-arrow @click-left="onBack"/>
    <vue-ui-frames-nav-bar v-else>
      <p slot="title" class="icon">
        <img :src="project.logo"/>
        <span>{{project.title}}</span>
      </p>
      <span slot="right" class="switch" @click="onSwitch">
        {{lang === 'en-US' ? '中文' : 'English'}}
      </span>
    </vue-ui-frames-nav-bar>
    <keep-alive>
      <router-view>
      </router-view>
    </keep-alive>
  </div>
</template>

<script>
import { getCurrentLang } from '../_utils'

export default {
  props: {
    config: Object,
    base: String
  },
  computed: {
    project () {
      return this.config.header.project
    },
    title () {
      const { name } = this.$route.meta
      return name ? name.replace(/-/g, '') : ''
    }
  },
  data () {
    return {
      lang: getCurrentLang()
    }
  },
  methods: {
    onSwitch () {
      const lang = this.lang === 'zh-CN' ? 'en-US' : 'zh-CN'
      this.$router.push(this.$route.path.replace(this.lang, lang))
      this.lang = lang
    },
    onBack() {
      history.back()
    }
  }
}
</script>

<style scoped>
.icon {
  font-size: 0;
}
.icon img {
  width: 24px;
  height: 24px;
  vertical-align: middle;
  margin-right: 10px;
}
.icon span {
  font-size: 18px;
  vertical-align: middle;
}
.switch {
  line-height: 1.499;
  display: inline-block;
  font-weight: 400;
  text-align: center;
  touch-action: manipulation;
  cursor: pointer;
  border: 1px solid transparent;
  white-space: nowrap;
  padding: 1px 6px;
  font-size: 14px;
  border-radius: 4px;
  user-select: none;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  position: relative;
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.015);
  color: #40a9ff;
  background-color: #fff;
  border-color: #40a9ff;
}
</style>
