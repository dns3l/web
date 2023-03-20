export default ({ app }, inject) => {
  // Inject $fetchHeader(token, method) in Vue, context and store.
  inject('fetchHeader', (t, m = 'GET', b) => {
    const i = {
      method: m,
      headers: { 'Content-Type': 'application/json' }
    }
    if (t) {
      i.headers.Authorization = 'Bearer ' + t
    }
    if (b) {
      i.body = JSON.stringify(b)
    }
    // console.log(JSON.stringify(i, null, ' '))
    return i
  })
}
