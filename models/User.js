const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    picture: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    watchlist: [{
        type: Schema.ObjectId,
        ref: 'Entry'
    }],
    googleID: {
        type: String,
        required: true
    },
    rated: [{
        _id: false,
        rating: {
            type: Number,
            required: true
        },
        entry: {
            type: Schema.ObjectId,
            ref: 'Entry'
        }
    }]
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;