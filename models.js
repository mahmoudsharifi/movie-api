const mongoose = require('mongoose')
const { Schema, model } = mongoose

const movieSchema = new Schema({
    Title: {type: String, required: true},
    Description: {type: String, required: true},
    Genre: {
        Name: String,
        Description: String
    },
    Director: {
        Name: String,
        Bio: String,
        Birth: Number,
        Death: Number
    },
    imageURL: String,
    featured: Boolean,
    Actors: [String]
})

const userSchema = new Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    email: {type: String, required: true},
    dob: Date,
    favorites: [Number]
})

module.exports = {
    Movie: model('Movie', movieSchema),
    User: model('User', userSchema)
}