const express = require('express');
const { existingFilters } = require('../config/keys');
const Entry = require('../models/Entry');
const Person = require('../models/Person');
const mongoose = require('mongoose');
const { detailsAddEdit, personAddEdit } = require('../controllers/admin');

const router = express.Router();

router.get('/details', async (req, res) => {
    const people = await Person.find({}, 'title').catch(err => console.log(err));
    res.render('add', {user: req.user, existingFilters, people});
});

router.post('/details', detailsAddEdit);

router.get('/person', async (req, res) => {
    const entries = await Entry.find({}, 'title').catch(err => console.log(err));
    res.render('add', { user: req.user, existingFilters, entries });
});

router.post('/person', personAddEdit);

module.exports = router;