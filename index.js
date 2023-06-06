const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const passport = require('passport')
const loginRouter = require('./auth.js')
let auth = require('./auth.js')(app)
const cors = require('cors')
const { check, validationResult } = require('express-validator');
require('dotenv').config()

const allowedOrigins = ['http://localhost:8081']
app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) { 
            let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
            return callback(new Error(message), false);
        }
        return callback(null, true);
    }
}));

const morgan = require('morgan')

const mongoose = require('mongoose')
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
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

app.get('/movies', 
  
    async (req, res) => {

    let movies = await Movie.find()
    res.json(movies)
})

app.get('/movie', 
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
    let movie = await Movie.findOne({ Title: req.query.title })

    res.json(movie)
})

app.get('/genre', 
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
    let movie = await Movie.findOne({ "Genre.Name": req.query.name })
    let genre = await movie.Genre
    res.json(genre)
})

app.get('/director', 
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
    let movie = await Movie.findOne({ "Director.Name": req.query.name })
    let director = await movie.Director
    res.json(director)
})

app.post('/user',
    
    passport.authenticate('jwt', { session: false }),
    check('username', 'Username contains non-alphanumeric characters - not allowed.').isAlphanumeric(),
    check('username', 'Username must be at least 3 characters long').isLength({min: 3}),
    check('email', 'Email does not appear to be valid').isEmail(),
    async (req, res) => {
    let { username, password, email } = req.body
    if (!username || !password || !email) res.status(400).send('Missing field').end()

    let hashedPassword = User.hashPassword(password);
    let alreadyExists = await User.findOne({ Username: req.body.Username })
    if (alreadyExists) {
        res.status(400).send('User already exists').end()
    }

    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() }).end()
    }

    let newUser = new User({ username, password: hashedPassword, email })
    await newUser.save()
    let users = await User.find()
    res.json(users)
})

app.put('/user', 
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
    let { oldUsername, newUsername, password } = req.body
    if (!oldUsername || !password || !newUsername) res.status(400).send('Missing field').end()
    await User.updateOne({ username: oldUsername, password }, {
        $set: {
            username: newUsername
        }
    })
    let users = await User.find()
    res.json(users)
})

app.post('/favorite', 
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
    let { username, password, newFavorite } = req.body
    if (!username || !password || !newFavorite) res.status(400).send('Missing field').end()
    await User.updateOne({ username, password }, {
        $push: {
            favorites: newFavorite
        }
    })
    let users = await User.find()
    res.json(users)
})

app.delete('/favorite', 
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
    let { username, password, deleteFavorite } = req.body
    if (!username || !password || !deleteFavorite) res.status(400).send('Missing field').end()
    let user = await User.findOne({ username, password })
    user.favorites.splice(user.favorites.indexOf(deleteFavorite), 1)
    await User.updateOne({ username, password }, {
        $set: {
            favorites: user.favorites
        }
    })
    let users = await User.find()
    res.json(users)
})

app.delete('/user', 
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
    let { username, password } = req.body
    if (!username || !password) res.status(400).send('Missing field').end()
    await User.findOneAndDelete({ username, password })
    let users = await User.find()
    res.json(users)
})

app.get('*', (req, res) => {
    res.send('File not found')
})

const port = process.env.PORT || 8081
app.listen(port, ()=>{console.log(`Listening on port ${port}`)})

function serveStatic(res, file) {
    res.sendFile(`${__dirname}/public/${file}`)
}

// npm start

