const express = require('express')
const app = express()

const morgan = require('morgan')

app.use(express.static('public'))
app.use(morgan('common'))

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.get('/', (req, res) => {
    serveStatic(res, 'index.html')
})

app.get('/documentation', (req, res) => {
    serveStatic(res, 'documentation.html')
})

app.get('/movies', (req, res) => {
    res.send('Successful GET, all movies')
})

app.get('/movie', (req, res) => {
    res.send('Successful GET, one movie')
})

app.get('/genre', (req, res) => {
    res.send('Successful GET, genre')
})

app.get('/director', (req, res) => {
    res.send('Successful GET, director')
})

app.post('/user', (req, res) => {
    res.send('Successful POST, signed up new user')
})

app.put('/user', (req, res) => {
    res.send('Successful PUT, changed username')
})

app.post('/favorite', (req, res) => {
    res.send('Successful POST, added new favorite')
})

app.delete('/favorite', (req, res) => {
    res.send('Successful DELETE, deleted favorite')
})

app.delete('/user', (req, res) => {
    res.send('Successful DELETE, deleted user')
})

app.get('*', (req, res) => {
    res.send('File not found')
})

app.listen(8080)

function serveStatic(res, file) {
    res.sendFile(`${__dirname}/public/${file}`)
}

// npm start

