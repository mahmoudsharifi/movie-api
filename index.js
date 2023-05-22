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

app.get('*', (req, res) => {
    res.send('File not found')
})

app.listen(8080)

function serveStatic(res, file) {
    res.sendFile(`${__dirname}/public/${file}`)
}

// npm start

