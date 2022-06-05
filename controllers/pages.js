const Entry = require('../models/Entry');
const Person = require('../models/Person');
const { existingFilters } = require('../config/keys');
const User = require('../models/User');

const home = async (req, res) => {
    try {
        const latestEntries = await Entry.find({}, 'title type rating img').limit(24);
        const popularEntries = await Entry.find({}, 'title type img popularity', {sort: '-popularity'}).limit(10);

        res.render('home', { latestEntries, popularEntries, user: req.user });
    } catch(err) {
        res.status(500).send('Server Error!');
    }
}

const list = async (req, res) => {
    let query = {}, sort;

    if(req.query.title) query.title = { "$regex": req.query.title, "$options": "i" };
    if(req.query.genres) query.genres = { "$all": req.query.genres.split(',') };
    if(req.query.types) query.type = { "$in": req.query.types.split(',') };
    if(req.query.status) query.status = { "$in": req.query.status.split(',') };
    if(req.query.countries) query.country = { "$in": req.query.countries.split(',') };
    if(req.query['year-from']) query.year = { "$gt": req.query['year-from'] };
    if(req.query['year-to']) query.year = { "$lt": req.query['year-to'], ...query.year };
    switch(req.query['sort-type']) {
        case 'Oldest':
            sort = { sort: '-createdAt' };
            break;
        case 'Rating LtH':
            sort = { sort: 'rating' };
            break;
        case 'Rating HtL':
            sort = { sort: '-rating' }; 
            break;
        case 'Popularity LtH':
            sort = { sort: 'popularity' };
            break;
        case 'Popularity HtL':
            sort = { sort: '-popularity' };
            break;
        default:
            sort = { sort: 'createdAt' };
            break;
    }

    const results = await Entry.find(query, 'title img', sort).limit(21).catch(err => console.log(err));

    res.render('list', { results, filters: req.query, existingFilters, user: req.user });
}

const listMore = async (req, res, next) => {
    if(parseInt(req.params.p) > 0) {
        let query = {}, sort;

        if(req.query.title) query.title = { "$regex": req.query.title, "$options": "i" };
        if(req.query.genres) query.genres = { "$all": req.query.genres.split(',') };
        if(req.query.types) query.type = { "$in": req.query.types.split(',') };
        if(req.query.status) query.status = { "$in": req.query.status.split(',') };
        if(req.query.countries) query.country = { "$in": req.query.countries.split(',') };
        if(req.query['year-from']) query.year = { "$gt": req.query['year-from'] };
        if(req.query['year-to']) query.year = { "$lt": req.query['year-to'], ...query.year };
        switch(req.query['sort-type']) {
            case 'Oldest':
                sort = { sort: '-createdAt' };
                break;
            case 'Rating LtH':
                sort = { sort: 'rating' };
                break;
            case 'Rating HtL':
                sort = { sort: '-rating' };
                break;
            case 'Popularity LtH':
                sort = { sort: 'popularity' };
                break;
            case 'Popularity HtL':
                sort = { sort: '-popularity' };
                break;
            default:
                sort = { sort: 'createdAt' };
                break;
        }

        const results = await Entry.find(query, 'title img', sort).skip(req.params.p*20).limit(21).catch(err => console.log(err));

        res.status(200).send(results);
    } else {
        next();
    }
}

const details = async (req, res) => {
    const details = await Entry.findOneAndUpdate({_id: req.params.id}, { $inc: { popularity: 1 } }).populate('cast.actor').exec().catch(err => console.log(err));

    if(!details?.title) return res.status(404).render('404', { user: req.user });

    const popularityRank = await Entry.find({"popularity": { "$gt" : details.popularity } }, '_id').count().catch(err => console.log(err));

    res.render('details', { details, popularityRank, user: req.user, rated: req.user?.rated.find(r => r.entry == req.params.id) });
}

const person = async (req, res) => {
    const person = await Person.findById(req.params.id).populate('roles').exec().catch(err => console.log(err));

    if(!person?.title) return res.status(404).render('404', { user: req.user });

    res.render('person', { person, user: req.user });
}

const profile = async (req, res) => {
    const user = await User.findById(req.user.id).populate('watchlist', 'title type rating img').exec((err, user) => {
        user.watchlist = user.watchlist.filter(w => w != null);
        user.rated = user.rated.filter(r => r != null);
        user.save();
        res.render('profile', { user });
    });
}

module.exports = { home, list, details, person, listMore, profile };