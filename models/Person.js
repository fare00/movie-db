const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const personSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    about: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    roles: [{
        type: Schema.ObjectId,
        ref: 'Entry'
    }]
}, { timestamps: true });

const Person = mongoose.model('Person', personSchema, 'people');

module.exports = Person;