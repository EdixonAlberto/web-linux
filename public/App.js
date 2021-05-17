new Vue({
  el: '#app',

  data() {
    return {
      date: new Date(),
      desktops: [1, 2, 3],
      currentDesktop: 1
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
    }
  },

  created() {
    this.initDateDynamic()
  }
})
