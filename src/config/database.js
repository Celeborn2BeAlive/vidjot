export const mongoURI = (() => {
    if (process.env.DATABASE_URL) {
        return process.env.DATABASE_URL
    }
    return 'mongodb://localhost/vidjot-dev'
})()