import express from 'express'
import _ from 'underscore'

// NuxtJS: API mocking example with delay and error injection...
import hello from './hello.json'

const app = express()

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

app.get('/hello', async (req, res) => {
  console.log('Header: ' + JSON.stringify(req.headers, null, ' '))
  console.log('Body: ' + JSON.stringify(req.body, null, ' '))
  const d = _.random(3, 5) // inject delay
  const r = _.random(1, 10) // inject random error
  console.log('Wait ' + d + 's before returning ' + (r < 6 ? 'OK' : 'Error') + '...\n')
  await sleep(d * 1000)
  return r < 6 ? res.status(200).json(hello) : res.status(500).json({ "code": 500, "message": "Ooops." })
});

app.delete('/ca/*/crt/*', async (req, res) => {
  console.log('Header: ' + JSON.stringify(req.headers, null, ' '))
  console.log('URL: ' + JSON.stringify(req.url, null, ' '))
  console.log('Body: ' + JSON.stringify(req.body, null, ' '))
  const d = _.random(3, 5) // inject delay
  const r = _.random(1, 10) // inject random error
  console.log('Wait ' + d + 's before returning ' + (r < 6 ? 'OK' : 'Error') + '...\n')
  await sleep(d * 1000)
  return r < 6 ? res.status(200).json(hello) : res.status(500).json({ "code": 500, "message": "Ooops." })
});

app.all('*', async (req, res, next) => {
  console.log('Header: ' + JSON.stringify(req.headers, null, ' '))
  console.log('URL: ' + JSON.stringify(req.url, null, ' '))
  console.log('Body: ' + JSON.stringify(req.body, null, ' '))
  return res.status(500).json({ "code": 500, "message": "What???" })
  // next()
});

module.exports = app
