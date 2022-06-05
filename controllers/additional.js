const Entry = require('../models/Entry');

const searchList = async (req, res) => {
    try {
        const entries = await Entry.find({}, 'title img');

        res.send(entries);
    } catch {
        res.sendStatus(500);
    }
}

module.exports = { searchList };