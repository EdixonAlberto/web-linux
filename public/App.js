new Vue({
  el: '#app',

  data() {
    return {
      date: new Date(),
      desktops: [1, 2, 3],
      currentDesktop: 1
    }
  },

  methods: {
    initDateDynamic() {
      setInterval(() => (this.date = new Date()), 1000 * 60)
    }
  },

  computed: {
    dateDynamic() {
      const weeks = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thusday',
        'Friday',
        'Saturday',
        'Sunday'
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
      const time = `${weeks[d.getDay() - 1]} ${months[d.getMonth()]} ${d.getMonth()} ${d.getDate()}, ${hours}:${minutes}`

      return { time, hours, minutes }
    }
  },

  created() {
    this.initDateDynamic()
  }
})
