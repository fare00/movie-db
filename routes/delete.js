const express = require('express');
const { deleteEntry, deletePerson } = require('../controllers/admin');

const router = express.Router();

router.delete('/details/:id', deleteEntry);

router.delete('/person/:id', deletePerson);

module.exports = router;