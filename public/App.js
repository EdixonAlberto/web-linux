import draggable from './static/js/draggable.js'

Vue.component('AppWindow', {
  template: '#app-window',

  props: {
    dataWindow: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      showWindow: true,
      maximizeWindow: false
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
      open('https://discord.com/app', 'newwindow', 'width=700,height=600')
    },

    getId() {
      return new Date().getTime().toString().substr(-3)
    },

    getPosition(quadrant) {
      const sizeHeader = '30px'

      switch (quadrant) {
        case 0:
          return { top: sizeHeader, left: '0' }
        case 1:
          return { top: sizeHeader, right: '0' }
        case 2:
          return { bottom: '0', left: '0' }
        case 3:
          return { bottom: '0', right: '0' }
        case 4:
          return {
            top: `calc(50% - (100vh / 2 - ${sizeHeader} / 2) / 2 + ${sizeHeader})`,
            left: `calc(50% - (100vw / 2) / 2)`
          }
      }
    },

    createAppWindow(newAppWindow) {
      const hiddendWindowFound = this.appWindowList.find(
        appWindow => appWindow.focus === false
      )

      if (hiddendWindowFound) {
        this.appWindowList = this.appWindowList.map(appWindow => ({
          ...appWindow,
          focus: true
        }))
      } else {
        if (this.appWindowList.length < 5) {
          const appWindowList = this.appWindowList.map(appWindow => ({
            ...appWindow,
            z: 0,
            focus: true
          }))

          // TODO: probar con otra estructura de datos
          appWindowList.push({
            ...newAppWindow,
            id: this.getId(),
            z: 4,
            focus: true,
            position: this.getPosition(this.appWindowList.length)
          })

          this.appWindowList = appWindowList
        } else alert('Maximo nro de ventanas alcanzado')
      }
    },

    deleteAppWindow(appWindowId) {
      this.appWindowList = this.appWindowList.filter(
        appWindow => appWindow.id !== appWindowId
      )
    },

    updateDistributionWindow(newAppWindow) {
      this.appWindowList.forEach(appWindow => {
        if (newAppWindow.id === appWindow.id) appWindow.z = 4
        else if (appWindow.z > 0) appWindow.z -= 1
      })
    },

    updateWindow(appWindow) {
      this.appWindowList = this.appWindowList.map(item => {
        return item.id === appWindow.id ? appWindow : item
      })
    }
  },

  created() {
    this.initDateDynamic()
  }
})
