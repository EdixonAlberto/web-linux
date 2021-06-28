class Cache {
  data = null

  constructor(initialData) {
    const data = this.getData()

    if (data) this.data = data
    else {
      this.setData(initialData)
      this.data = initialData
    }
  }

  getData() {
    return JSON.parse(localStorage.getItem('data'))
  }

  setData(newData) {
    const localData = {
      ...this.data,
      ...newData
    }

    localStorage.setItem('data', JSON.stringify(localData))
    this.data = localData
  }

  cleanData() {
    localStorage.clear()
    this.data = null
  }
}

export default Cache
