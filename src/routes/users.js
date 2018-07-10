import express from 'express'
import bcrypt from 'bcryptjs'
import passport from 'passport'

import User from '../models/User'

const router = express.Router()

// User Login Route
router.get('/login', (req, res) => {
    res.render('users/login')
})

// Login Form POST
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/ideas',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next)
})

// User Register Route
router.get('/register', (req, res) => {
    res.render('users/register')
})

// Register Form Post
router.post('/register', async (req, res) => {
    const errors = []
    if (req.body.password != req.body.confirmPassword) {
        errors.push({ text: 'Passwords do not match' })
    }
    if (req.body.password.length < 4) {
        errors.push({ text: 'Password must be at least 4 characters' })
    }
    if (errors.length > 0) {
        res.render('users/register', {
            errors: errors,
            ...req.body
        })
        return
    }

    const user = await User.findOne({ email: req.body.email })
    if (user) {
        req.flash('error_msg', 'Email already registered')
        res.redirect('/users/register')
        return
    }

    const { confirmPassword, ...newUser } = req.body // Extract all properties from req.body in newUser object, except 'confirmPassword'
    const salt = await bcrypt.genSalt(10)
    newUser.password = await bcrypt.hash(newUser.password, salt)

    try {
        await new User(newUser).save()
        req.flash('success_msg', 'You are now registered and can log in')
        res.redirect('/users/login')
    }
    catch (err) {
        console.error(err)
        return
    }
})

export default router