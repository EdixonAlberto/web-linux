import dates from './data/dates.json'
import widgetList from './data/widgetList.json'
import accessList from './data/accessList.json'
import Cache from './Cache'

// COMPONENTS
import './components/AppWindow'
import './components/AppAccess'

// CACHE
const cache = new Cache({
  desktops: [1],
  currentDesktop: 0,
  progressBar: { brightness: '10', volume: '3' },
  isLock: null
})

// APP
new Vue({
  el: '#app',

  data() {
    return {
      ...cache.data,
      date: new Date(),
      calendarDate: new Date(),
      isMaximizedWindow: false,
      appWindowList: [],
      appAccessList: accessList,
      accessEvent: '',
      widgetList
    }
  },

  computed: {
    dateDynamic() {
      const [weeks, months] = dates

      const d = this.date
      const hours = d.getHours() < 10 ? '0' + d.getHours() : d.getHours()
      const minutes = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()
      const days = d.getDate() < 10 ? '0' + d.getDate() : d.getDate()

      // prettier-ignore
      const fullDate = `${weeks[d.getDay()]} ${months[d.getMonth()]} ${days}, ${hours}:${minutes}`
      // prettier-ignore
      const fullDateLock = `${weeks[d.getDay()]}, ${months[d.getMonth()]} ${days}, ${d.getFullYear()}`

      return { fullDate, fullDateLock, hours, minutes }
    },

    isMobile() {
      return window.screen.width < 768
    }
  },

  methods: {
    initDateDynamic() {
      setInterval(() => (this.date = new Date()), 1000 * 60)
    },

    // TODO: investigar como abrir discord web fron un appWindow
    // openDiscord() {
    //// opcion 1
    //   open('https://discord.com/app', 'newwindow', 'width=700,height=600')

    //// opcion 2
    //   this.createAppWindow({
    //     title: 'Discord',
    //     type: 'web',
    //     link: 'https://www.discord.com/app&output=embed'
    //   })
    // },

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
      const windowNotRepeted = !this.appWindowList.length
        ? true
        : !this.appWindowList.some(appWindow => appWindow.title === newAppWindow.title)

      if (windowNotRepeted) {
        const appWindowList = this.appWindowList.map(appWindow => ({
          ...appWindow,
          z: 0
        }))

        appWindowList.push({
          ...newAppWindow,
          id: this.getId(),
          z: 4,
          focus: true,
          position: this.getPosition(this.appWindowList.length)
        })

        this.appWindowList = appWindowList
      } else {
        this.appWindowList = this.appWindowList.map(appWindow => {
          return appWindow.title === newAppWindow.title
            ? {
                ...appWindow,
                focus: !appWindow.focus
              }
            : appWindow
        })
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
    },

    isWidgetActived(windowTitle) {
      const widgetIndex = this.appWindowList.findIndex(
        appWindow => appWindow.title === windowTitle
      )
      return widgetIndex > -1
    },

    handlerLock(action) {
      const removeEvent = () => document.removeEventListener('keypress', null)

      switch (action) {
        case 'lock':
          this.desktop = 1
          this.isLock = true

          document.addEventListener('keypress', () => {
            this.isLock = false
            removeEvent()
          })
          break

        case 'unlock':
          this.isLock = false
          removeEvent()
          break
      }
    }
  },

  watch: {
    // TODO: mejorar la forma en la que se actualiza la cache
    desktops(val) {
      cache.setData({ desktops: val })
    },
    currentDesktop(val) {
      cache.setData({ currentDesktop: val })
    },
    'progressBar.brightness'(val) {
      cache.setData({ brightness: val })
    },
    'progressBar.volume'(val) {
      cache.setData({ volume: val })
    },
    isLock(val) {
      cache.setData({ isLock: val })
    }
  },

  created() {
    this.initDateDynamic()
  }
})
