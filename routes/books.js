const express = require("express")

const bookModel = require("../models/books")

const bookRouter = express.Router()

bookRouter.get("/", (req, res) => {
    bookModel.find({})
        .then((books) => {
            res.render('books', {user: req.user, books})
        }).catch((err) => {
            res.status(500).send(err.message)
        })
})

// Get book by ID
bookRouter.get("/:id", (req, res) => {
    const id = req.params.id
    bookModel.findById(id)
        .then((book) => {
            res.status(200).send({
                message: "Book",
                data: book
            })
        }).catch((err) => {
            res.status(400).send(err)
        })
})

// Create Book
bookRouter.post("/", (req, res) => {
    const book = req.body
    bookModel.create(book)
        .then((book) => {
            res.status(201).send({
                message: "Book added Successfull",
                data: book
            })
        }).catch((err) => {
            res.status(404).send(err)
        })
})

bookRouter.put("/:id", (req, res) => {
    const id = req.params.id
    const book = req.body

    bookModel.findByIdAndUpdate(id, book, {new: true})
        .then((book) => {
            res.status(200).send({
                message: "Book Updated",
                data: book
            })
        }).catch((err) => {
            res.status(404).send(err)
        })
})

bookRouter.delete("/:id", (req, res) => {
    const id = req.params.id

    bookModel.findByIdAndDelete(id)
        .then(() => {
            res.status(200).send({
                messsage: "Book Deleted",
                data: ""
            })
        }).catch((err) => {
            res.status(404).send(err)
        })
})



module.exports = bookRouter