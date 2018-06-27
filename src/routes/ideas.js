import express from 'express'
import mongoose from 'mongoose'

import '../models/Idea'
const Idea = mongoose.model('ideas')

const router = express.Router()

// Idea List
router.get('/', async (req, res) => {
    const ideas = await Idea.find({}).sort({ date: 'descending' })
    res.render('ideas/index', { ideas })
})

// Add Idea Form
router.get('/add', (req, res) => {
    res.render('ideas/add')
})

// Add Idea form process
router.post('/', async (req, res) => {
    let errors = []

    if (!req.body.title) {
        errors.push({ text: 'Please add a title' })
    }
    if (!req.body.details) {
        errors.push({ text: 'Please add some details' })
    }

    if (errors.length > 0) {
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        })
        return
    }

    const newUser = { ...req.body }
    await new Idea(newUser).save()

    req.flash('success_msg', 'Video idea added')
    res.redirect('/ideas')
})

// Edit Idea Form
router.get('/edit/:id', async (req, res) => {
    const idea = await Idea.findOne({
        _id: req.params.id
    })
    res.render('ideas/edit', { idea })
})

// Edit Idea form process
router.put('/:id', async (req, res) => {
    const idea = await Idea.findOne({ _id: req.params.id })
    idea.title = req.body.title
    idea.details = req.body.details
    await idea.save()
    req.flash('success_msg', 'Video idea updated')
    res.redirect('/ideas')
})

// Delete Idea
router.delete('/:id', async (req, res) => {
    await Idea.remove({ _id: req.params.id })
    req.flash('success_msg', 'Video idea removed')
    res.redirect('/ideas')
})

export default router