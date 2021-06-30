import draggable from '../draggable'

Vue.component('AppWindow', {
  template: /* vue-html */ `
    <div
      v-show="dataWindow.focus"
      ref="appWindow"
      class="app-window"
      :class="{
        show: showWindow,
        maximize: maximizeWindow,
        focus: dataWindow.z === 4
      }"
      :style="styleCustom"
      @mousedown="$emit('distribution-window', dataWindow)"
    >
      <header @click="updatePosition">
        <div class="separator"></div>

        <span v-text="dataWindow.title"></span>

        <div class="buttons">
          <span @click="updateFocus"></span>
          <span @click="maximize"></span>
          <span @click="$emit('deleted-window', dataWindow.id)"></span>
        </div>
      </header>

      <div class="body" :class="{ 'header-browser': dataWindow.type === 'browser' }">
        <div id="browser" v-if="dataWindow.type === 'browser'">
          <div class="search-bar">
            <div class="navegation">
              <i class="fa fa-arrow-circle-left" aria-hidden="true"></i>
              <i class="fa fa-arrow-circle-right" aria-hidden="true"></i>
              <i class="fa fa-repeat" aria-hidden="true" @click="setBrowserUrl()"></i>
              <i
                class="fa fa-home"
                aria-hidden="true"
                @click="setBrowserUrl('google.com')"
              ></i>
            </div>

            <div class="input">
              <div class="icons">
                <i class="fa fa-shield" aria-hidden="true"></i>
                <span></span>
                <i class="fa fa-lock" aria-hidden="true"></i>
              </div>

              <input
                type="text"
                v-model="browserInput"
                @keyup.enter="setBrowserUrl()"
              />
            </div>

            <div class="menu">
              <i class="fa fa-user-circle-o" aria-hidden="true"></i>
              <span></span>
              <i class="fa fa-bars" aria-hidden="true"></i>
            </div>
          </div>

          <iframe :src="this.browserUrl" frameborder="0"></iframe>
        </div>

        <div id="terminal" v-else-if="dataWindow.type === 'terminal'">
          <textarea autocomplete="off"></textarea>
        </div>

        <div id="web" v-else-if="dataWindow.type === 'web'">
          <iframe :src="dataWindow.link" frameborder="0"></iframe>
        </div>
      </div>
    </div>
  `,

  props: {
    dataWindow: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      showWindow: true,
      maximizeWindow: false,
      browserInput: 'https://www.google.com',
      browserUrl: 'https://www.google.com/webhp?igu=1'
    }
  },

  computed: {
    styleCustom() {
      return {
        zIndex: 1000 + this.dataWindow.z,
        ...this.dataWindow.position
      }
    }
  },

  methods: {
    maximize() {
      this.$refs.appWindow.style.transition = 'all 0.15s ease-in-out'
      this.maximizeWindow = !this.maximizeWindow
      this.$emit('maximized-window')
    },

    updateFocus() {
      const newAppWindow = {
        ...this.dataWindow,
        focus: !this.dataWindow.focus
      }

      this.$emit('update-window', newAppWindow)
    },

    updatePosition(evt) {
      // TODO: mejorar actualizacion de la posicion por medio del evento
      // console.log(evt.button, evt.buttons)

      const appWindow = this.$refs.appWindow

      if (appWindow) {
        const newAppWindow = {
          ...this.dataWindow,
          position: {
            top: appWindow.style.top,
            right: appWindow.style.right,
            bottom: appWindow.style.bottom,
            left: appWindow.style.left
          }
        }

        this.$emit('update-window', newAppWindow)
      }
    },

    setBrowserUrl(input = '') {
      let inputUrl = input || this.browserInput
      const isGoogle = inputUrl.search(/google.com$/) > -1

      inputUrl = isGoogle ? 'www.google.com' : inputUrl
      this.browserInput = `https://${inputUrl}`

      inputUrl = isGoogle ? 'google.com/webhp?igu=1' : inputUrl
      this.browserUrl = `https://${inputUrl}`
    }
  },

  mounted() {
    const { appWindow } = this.$refs
    const appHeader = appWindow.children[0]
    const buttons = appHeader.children[2]
    const header = document.querySelector('header')

    const offsetPosition = {
      left: 0,
      top: header.clientHeight
    }

    draggable(appWindow, appHeader, buttons, offsetPosition)
  }
})
