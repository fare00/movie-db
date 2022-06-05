const Entry = require('../models/Entry');
const Person = require('../models/Person');
const mongoose = require('mongoose');

const detailsAddEdit = async (req, res) => {
    let entry = {};

    for(let prop in req.body) {
        if(prop != 'cast_id' && prop != 'cast_char' && prop != 'ep_title' && prop != 'ep_img' && prop != 'ep_ses' && prop != 'ep_num')
            entry[prop] = req.body[prop];
    }

    entry.cast = [];
    entry.episodes = [];
    entry.rating = {
        count: 0,
        sum: 0
    };
    entry.genres = req.body.genres.split(',');
    entry.popularity = 0;


    if(req.body.cast_id) {
         if(typeof req.body.cast_id == 'object') {
             req.body.cast_id.forEach((cid, i) => {
                if(cid.length == 24) entry.cast.push({actor: mongoose.Types.ObjectId(req.body.cast_id[i]), character: req.body.cast_char[i]});
             });
         }
         else if (typeof req.body.cast_id == 'string' && req.body.cast_id.length == 24) entry.cast = [{actor: mongoose.Types.ObjectId(req.body.cast_id), character: req.body.cast_char}];
    }

    if(req.body.ep_title) {
        if(typeof req.body.ep_title == 'object') {
            req.body.ep_title.forEach((title, i) => {
                if(title && req.body.ep_img[i] && req.body.ep_ses[i] && req.body.ep_num[i]) entry.episodes.push({title: title, img: req.body.ep_img[i], snum: req.body.ep_ses[i], enum: req.body.ep_num[i]})
            });
        }
        else if(typeof req.body.ep_title == 'string' && req.body.ep_img && req.body.ep_ses && req.body.ep_num) entry.episodes = [{title: req.body.ep_title, img: req.body.ep_img, snum: req.body.ep_ses, enum: req.body.ep_num}];
    }

    if(req.baseUrl.includes('add')) {
        const addedEntry = await Entry(entry).save().catch(err => console.log(err));
        if(addedEntry) {
            entry.cast.forEach(async c => {
                const person = await Person.findById(c.actor).catch(err => console.log(err));
                person.roles = [...person.roles, addedEntry._id];
                await person.save().catch(err => console.log(err));
            });
        }
        res.redirect('/add/details');
    } else {
        const oldEntry = await Entry.findByIdAndUpdate({_id: req.params.id}, entry);
        if(oldEntry) {
            const noLongerRole = oldEntry.cast.filter(c => !entry.cast.find(ec => ec.actor.toString() == c.actor));
            
            noLongerRole.forEach(async role => {
                const person = await Person.findById(role.actor).catch(err => console.log(err));
                person.roles = person.roles.filter(r => r != oldEntry.id);
                await person.save().catch(err => console.log(err));
            });
            entry.cast.forEach(async role => {
                const person = await Person.findById(role.actor).catch(err => console.log(err));
                if(!person.roles.find(r => r == oldEntry.id)) {
                    person.roles = [...person.roles, oldEntry.id];
                    await person.save().catch(err => console.log(err));
                }
            });
        }
        res.redirect('/edit/details/'+req.params.id);
    }
}

const personAddEdit = async (req, res) => {
    const person = {};
    const cast = [];

    for(let prop in req.body) {
        if(prop != 'role_id' && prop != 'role_char') person[prop] = req.body[prop];
    }

    person.roles = [];

    if(req.body.role_id) {
        if(typeof req.body.role_id == 'object') {
            req.body.role_id.forEach((rid, i) => {
                if(rid.length == 24) {
                    person.roles.push(mongoose.Types.ObjectId(rid));
                    cast.push({entry: rid, character: req.body.role_char[i] ?? ''});
                }
            });
        }
        else if(typeof req.body.role_id == 'string' && req.body.role_id?.length == 24) {
            person.roles = [mongoose.Types.ObjectId(req.body.role_id)];
            cast.push({entry: req.body.role_id, character: req.body.role_char ?? ''});
        }
    }

    if(req.baseUrl.includes('add')) {
        const addedPerson = await Person(person).save().catch(err => console.log(err));
        if(addedPerson) {
            cast.forEach(async c => {
                const entry = await Entry.findById(c.entry).catch(err => console.log(err));
                entry.cast = [...entry.cast, { actor: addedPerson._id, character: c.character }];
                await entry.save().catch(err => console.log(err));
            });
        }
        res.redirect('/add/person');
    } else {
        const oldPerson = await Person.findByIdAndUpdate({_id: req.params.id}, person).catch(err => console.log(err));
        if(oldPerson) {
            const noLongerCast = oldPerson.roles.filter(role => !cast.find(c => c.entry == role));

            noLongerCast.forEach(async role => {
                const entry = await Entry.findById(role).catch(err => console.log(err));
                entry.cast = entry.cast.filter(c => c.actor != oldPerson.id);
                await entry.save().catch(err => console.log(err));
            });
            cast.forEach(async c => {
                const entry = await Entry.findById(c.entry).catch(err => console.log(err));
                const exists = entry.cast.find(ec => ec.actor == oldPerson.id);
                if(exists) entry.cast = entry.cast.map(ec => ((ec.actor == oldPerson.id) ? { actor: oldPerson.id, character: c.character } : ec));
                else entry.cast = [...entry.cast, { actor: oldPerson.id, character: c.character }];
                await entry.save().catch(err => console.log(err));
            });
        }
        res.redirect('/edit/person/'+req.params.id);
    }
}

const deleteEntry = async (req, res) => {
    const entry = await Entry.findById(req.params.id).catch(err => console.log(err));

    if(!entry?.title) return res.sendStatus(500);

    for(let role of entry.cast) {
        const person = await Person.findById(role.actor).catch(err => console.log(err));

        person.roles = person.roles.filter(r => r.toString() !== req.params.id);

        await person.save().catch(err => console.log(err));
    }

    const deleted = await Entry.deleteOne({_id: req.params.id}).catch(err => console.log(err));

    if(deleted?.deletedCount !== 1) return res.sendStatus(500);

    res.sendStatus(200);
}

const deletePerson = async (req, res) => {
    const person = await Person.findById(req.params.id).catch(err => console.log(err));

    if(!person?.title) return res.sendStatus(500);

    for(let cast of person.roles) {
        const entry = await Entry.findById(cast).catch(err => console.log(err));

        entry.cast = entry.cast.filter(c => c.actor.toString() !== req.params.id);

        await entry.save().catch(err => console.log(err));
    }

    const deleted = await Person.deleteOne({_id: req.params.id}).catch(err => console.log(err));
    
    if(deleted?.deletedCount !== 1) return res.sendStatus(500);

    res.sendStatus(200);
}

module.exports = { detailsAddEdit, personAddEdit, deleteEntry, deletePerson }