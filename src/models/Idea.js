import mongoose, { Schema } from 'mongoose'

const IdeaSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    details: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now
    }
})

export default mongoose.model('ideas', IdeaSchema)