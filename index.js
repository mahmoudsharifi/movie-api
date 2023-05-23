const express = require('express')
const bodyParser = require('body-parser')
const app = express()

const morgan = require('morgan')

const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/moviedb', { useNewUrlParser: true, useUnifiedTopology: true });
// npm start

const { Movie, User } = require('./models.js')

app.use(express.static('public'))
app.use(morgan('common'))
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))

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

app.get('/movies', async (req, res) => {
    let movies = await Movie.find()
    res.json(movies)
})

app.get('/movie', async (req, res) => {
    let movie = await Movie.findOne({Title: req.query.title})
    res.json(movie)
})

app.get('/genre', async (req, res) => {
    let movie = await Movie.findOne({"Genre.Name": req.query.name})
    let genre = await movie.Genre
    res.json(genre)
})

app.get('/director', async (req, res) => {
    let movie = await Movie.findOne({"Director.Name": req.query.name})
    let director = await movie.Director
    res.json(director)
})

app.post('/user', async (req, res) => {
    let {username, password, email} = req.body
    if (!username || !password || !email) res.status(400).send('Missing field').end()
    let newUser = new User({username, password, email})
    await newUser.save()
    let users = await User.find()
    res.json(users)
})

app.put('/user', async (req, res) => {
    let {oldUsername, newUsername, password} = req.body
    if (!oldUsername || !password || !newUsername) res.status(400).send('Missing field').end()
    await User.updateOne({username: oldUsername, password}, {
        $set: {
            username: newUsername
        }
    })
    let users = await User.find()
    res.json(users)
})

app.post('/favorite', async (req, res) => {
    let {username, password, newFavorite} = req.body
    if (!username || !password || !newFavorite) res.status(400).send('Missing field').end()
    await User.updateOne({username, password}, {
        $push: {
            favorites: newFavorite
        }
    })
    let users = await User.find()
    res.json(users)
})

app.delete('/favorite', async (req, res) => {
    let {username, password, deleteFavorite} = req.body
    if (!username || !password || !deleteFavorite) res.status(400).send('Missing field').end()
    let user = await User.findOne({username, password})
    user.favorites.splice(user.favorites.indexOf(deleteFavorite), 1)
    await User.updateOne({ username, password }, {
        $set: {
            favorites: user.favorites
        }
    })
    let users = await User.find()
    res.json(users)
})

app.delete('/user', async (req, res) => {
    let {username, password} = req.body
    if (!username || !password) res.status(400).send('Missing field').end()
    await User.findOneAndDelete({username, password})
    let users = await User.find()
    res.json(users)
})

app.get('*', (req, res) => {
    res.send('File not found')
})

app.listen(8081)

function serveStatic(res, file) {
    res.sendFile(`${__dirname}/public/${file}`)
}

// npm start

