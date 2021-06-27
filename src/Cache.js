class Cache {
  constructor() {}

  static getData() {
    return JSON.parse(localStorage.getItem('data'))
  }

  static setData(newData) {
    const localData = {
      ...this.getData(),
      ...newData
    }
    localStorage.setItem('data', JSON.stringify(localData))
  }

  static cleanData() {
    localStorage.clear()
  }
}

export default Cache
