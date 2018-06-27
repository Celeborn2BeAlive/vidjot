import express from 'express'

const router = express.Router()

// User Login Route
router.get('/login', (req, res) => {
    res.render('users/login')
})

// User Register Route
router.get('/register', (req, res) => {
    res.render('users/register')
})

export default router