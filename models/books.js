const mongoose = require("mongoose");

// Define new schema
const Schema = mongoose.Schema;

const BookModelSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    
    year: {
        type: Number,
        required: true,
        max: [2022, "Year must be less than 2023"]
    },

    isbn: {
        type: String,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now()
    },

    updatedAt: {
        type: Date,
        default: Date.now()
    }
})

// Create Model from the schema
module.exports = mongoose.model("books", BookModelSchema);