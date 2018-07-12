import { user, password } from './db_credentials'

export const mongoURI = (() => {
    if (process.env.NODE_ENV === 'production') {
        return `mongodb://${user}:${password}@ds235711.mlab.com:35711/vidjot-prod`
    }
    return 'mongodb://localhost/vidjot-dev'
})()