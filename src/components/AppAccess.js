import draggable from '../draggable'

Vue.component('AppAccess', {
  template: /* vue-html */ `
    <div
      ref="appAccess"
      class="access-container"
      :class="{ active }"
      :style="dataAccess.position"
    >
      <span v-html="dataAccess.iconHtml"></span>
      <span class="name" v-text="dataAccess.name"></span>
    </div>
  `,

  props: {
    dataAccess: {
      type: Object,
      required: true
    },
    event: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      active: false
    }
  },

  watch: {
    event(val) {
      console.log(val)
    }
  },

  mounted() {
    const header = document.querySelector('header')
    const widgetSide = document.querySelector('section.widget-side')

    const offsetPosition = {
      left: widgetSide.clientWidth,
      top: header.clientHeight
    }

    draggable(this.$refs.appAccess, null, null, offsetPosition)
  }
})
