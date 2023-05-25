const mongoose = require('mongoose')
const { Schema, model } = mongoose
const bcrypt = require('bcrypt')

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



userSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
};

userSchema.methods.validatePassword = function (password) {
    return bcrypt.compareSync(password, this.Password);
};

module.exports = {
    Movie: model('movies', movieSchema),
    User: model('users', userSchema)
}