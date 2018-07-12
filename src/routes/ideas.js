import express from 'express'
import mongoose from 'mongoose'
import Idea from '../models/Idea'
import { ensureAuthenticated } from '../helpers/auth'

const router = express.Router()

// Idea List
router.get('/', ensureAuthenticated, async (req, res) => {
    const ideas = await Idea.find({
        user: req.user.id
    }).sort({ date: 'descending' })
    res.render('ideas/index', { ideas })
})

// Add Idea Form
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('ideas/add')
})

// Add Idea form process
router.post('/', ensureAuthenticated, async (req, res) => {
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

    const newUser = { ...req.body, user: req.user.id }
    await new Idea(newUser).save()

    req.flash('success_msg', 'Video idea added')
    res.redirect('/ideas')
})

function ensureUser(idea, req, res, next) {
    if (idea.user == req.user.id) {
        return next();
    }
    req.flash('error_msg', 'Not authorized')
    res.redirect('/ideas')
}

// Edit Idea Form
router.get('/edit/:id', ensureAuthenticated, async (req, res) => {
    const idea = await Idea.findOne({
        _id: req.params.id
    })
    ensureUser(idea, req, res, () => {
        res.render('ideas/edit', { idea })
    })
})

// Edit Idea form process
router.put('/:id', ensureAuthenticated, async (req, res) => {
    const idea = await Idea.findOne({ _id: req.params.id })
    ensureUser(idea, req, res, async () => {
        idea.title = req.body.title
        idea.details = req.body.details
        await idea.save()
        req.flash('success_msg', 'Video idea updated')
        res.redirect('/ideas')
    })
})

// Delete Idea
router.delete('/:id', ensureAuthenticated, async (req, res) => {
    const result = await Idea.deleteOne({ _id: req.params.id, user: req.user.id })
    if (result.n == 0) {
        req.flash('error_msg', 'Not authorized')
        res.redirect('/ideas')
        return
    }
    req.flash('success_msg', 'Video idea removed')
    res.redirect('/ideas')
})

export default router