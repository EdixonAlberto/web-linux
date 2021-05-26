import draggable from './static/js/draggable.js'

Vue.component('AppWindow', {
  template: '#app-window',

  props: {
    window: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      showWindow: true,
      maxWindow: false
    }
  },

  methods: {
    maximize() {
      this.$refs.appWindow.style.transition = 'all 0.15s ease-in-out'
      this.maxWindow = !this.maxWindow
      this.$emit('maximized-window')
    }
  },

  watch: {
    showWindow(val) {
      this.show = val
    }
  },

  mounted() {
    draggable(this.$refs.appWindow)
  }
})

new Vue({
  el: '#app',

  data() {
    return {
      // TODO: guardar config en localstore
      date: new Date(),
      desktops: [1, 2, 3],
      desktop: 1,
      brightness: 8,
      isMaximizedWindow: false,
      appWindowList: []
    }
  },

  computed: {
    dateDynamic() {
      const weeks = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
      ]
      const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ]
      const d = this.date
      const hours = d.getHours() < 10 ? '0' + d.getHours() : d.getHours()
      const minutes = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()

      // prettier-ignore
      const time = `${weeks[d.getDay()]} ${months[d.getMonth()]} ${d.getMonth()} ${d.getDate()}, ${hours}:${minutes}`

      return { time, hours, minutes }
    }
  },

  methods: {
    initDateDynamic() {
      setInterval(() => (this.date = new Date()), 1000 * 60)
    },

    openDircord() {
      window.open('https://discord.com/app', 'newwindow', 'width=700,height=600')
    },

    createAppWindow(window) {
      // TODO: probar con otra estructura de datos
      this.appWindowList.push({
        ...window,
        id: this.appWindowList.length
      })
    },

    deleteAppWindow(windowId) {
      this.appWindowList = this.appWindowList.map(appWindow => {
        return appWindow?.id !== windowId ? appWindow : null
      })
    }
  },

  created() {
    this.initDateDynamic()
  }
})
