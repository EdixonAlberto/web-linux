new Vue({
  el: '#app',

  data() {
    return {
      date: new Date()
    }
  },

  methods: {
    getDate() {
      const d = this.date
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

      // prettier-ignore
      return `${weeks[d.getDay() - 1]} ${months[d.getMonth()]} ${d.getMonth()} ${d.getDate()}, ${d.getHours()}:${d.getMinutes()}`
    }
  }
})
