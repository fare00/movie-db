const express = require('express');
const mongoose = require('mongoose');
const Entry = require('../models/Entry');

const router = express.Router();

router.put('/watchlist/:id', async (req, res) => {
    const entry = await Entry.findById(req.params.id).catch(err => console.log(err));
    if(!entry) res.sendStatus(404);
    else {
        if(req.user.watchlist.includes(req.params.id)) req.user.watchlist = req.user.watchlist.filter(e => e != req.params.id);
        else req.user.watchlist.push(mongoose.Types.ObjectId(req.params.id));
        const user = await req.user.save().catch(err => console.log(err));
        if(user) res.sendStatus(200);
        else res.sendStatus(404);
    }
});

router.put('/rate/:id', async (req, res) => {
    const entry = await Entry.findById(req.params.id).catch(err => console.log(err));

    if(!entry || req.body.rate > 5 || req.body.rate < 1) return res.sendStatus(404);

    if(entry.rating.count == 0) entry.rating = { count: 0, sum: 0 };

    const foundRating = req.user.rated.find(r => r.entry == req.params.id);
    
    if(!foundRating) {
        req.user.rated.push({ entry: mongoose.Types.ObjectId(req.params.id), rating: req.body.rate });
        entry.rating.count++;
        entry.rating.sum += req.body.rate;
        const [user, ent] = await Promise.all([req.user.save(), entry.save()]).catch(err => console.log(err));
        if(!user || !ent) return res.sendStatus(404);
        return res.status(200).send(`${ent.rating.count ? ent.rating.sum/ent.rating.count : 0}`);
    }
    
    if(foundRating.rating == req.body.rate) {
        req.user.rated = req.user.rated.filter(r => r.entry != req.params.id);
        entry.rating.count--;
        entry.rating.sum -= req.body.rate;
        const [user, ent] = await Promise.all([req.user.save(), entry.save()]).catch(err => console.log(err));
        if(!user || !ent) return res.sendStatus(404);
        return res.status(200).send(`${ent.rating.count ? ent.rating.sum/ent.rating.count : 0}`);
    } else {
        entry.rating.sum -= foundRating.rating;
        entry.rating.sum += req.body.rate;
        req.user.rated = req.user.rated.map(r => {
            if(r.entry == req.params.id) return { entry: r.entry, rating: req.body.rate };
            return r;
        });
        const [user, ent] = await Promise.all([req.user.save(), entry.save()]).catch(err => console.log(err));
        if(!user || !ent) return res.sendStatus(404);
        return res.status(200).send(`${ent.rating.count ? ent.rating.sum/ent.rating.count : 0}`);
    }
});

module.exports = router;