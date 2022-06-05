const express = require('express');
const Entry = require('../models/Entry');
const {existingFilters} = require('../config/keys');
const Person = require('../models/Person');
const admin = require('../controllers/admin');

const router = express.Router();

router.get('/details/:id', async (req, res) => {
    const entry = await Entry.findById(req.params.id).catch(err => console.log(err));
    const people = await Person.find({}, 'title').catch(err => console.log(err));
    res.render('edit', { user: req.user, existingFilters, entry, people});
});

router.post('/details/:id', admin.detailsAddEdit);

router.get('/person/:id', async (req, res) => {
    const entries = await Entry.find({}, 'title').catch(err => console.log(err));
    const person = await Person.findById(req.params.id).populate('roles', 'title cast').catch(err => console.log(err));
    res.render('edit', { user: req.user, existingFilters, person, entries});
});

router.post('/person/:id', admin.personAddEdit);

module.exports = router;