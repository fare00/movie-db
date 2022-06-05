const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const entrySchema = new Schema({
    title: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    trailer: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    rating: {
        count: {
            type: Number,
            required: true
        },
        sum: {
            type: Number,
            required: true
        }
    },
    popularity: {
        type: Number,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    genres: {
        type: Array,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    cast: [{
        _id: false,
        character: String,
        actor: {
            type: Schema.ObjectId,
            ref: 'Person'
        }
    }],
    episodes: [{
        title: {
            type: String,
            required: true
        },
        img: {
            type: String,
            required: true
        },
        enum: {
            type: Number,
            required: true
        },
        snum: {
            type: Number,
            required: true
        }
    }]
}, { timestamps: true });

const Entry = mongoose.model('Entry', entrySchema, 'entries');

module.exports = Entry;