import { Strategy as LocalStrategy } from 'passport-local'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

// Load user model
const User = mongoose.model('users')

export default function (passport) {
    passport.use(new LocalStrategy({
        usernameField: 'email'
    }, async (email, password, done) => {
        // Match user
        const user = await User.findOne({ email })
        if (!user) {
            return done(null, false, { message: 'No user found.' })
        }

        // Match password
        try {
            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) {
                return done(null, false, { message: 'Password incorrect.' });
            }
            return done(null, user)
        } catch (err) {
            return done(null, false, { message: `Unknown error: ${err}.` });
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user)
        })
    })
}