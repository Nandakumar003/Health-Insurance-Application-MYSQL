const express = require("express")
const UserNotes = require("../models/notes")
const router = express.Router()

router
    .get('/GetAllNotes', async (req, res) => {
        try {
            const notes = await UserNotes.getAllNotes()
            res.send(notes)
        } catch (err) {
            res.status(401).send({ message: err.message })
        }
    })

    .get('/GetUserNotes', async (req, res) => {
        try {
            const notes = await UserNotes.getSpecificUserNotes(req.query)
            if (notes.length != 0) {
                notes.sort((a, b) => {
                    return new Date(a.CreatedOn) - new Date(b.CreatedOn); // descending
                })
                res.send(notes)
            }
            else {
                throw Error`There is no notes !!`
            }
        } catch (err) {
            res.status(401).send({ message: err.message })
        }
    })

    .post('/AddNotes', async (req, res) => {
        try {
            const usernotes = await UserNotes.addnotes(req.body)
            usernotes.sort((a, b) => {
                return new Date(a.CreatedOn) - new Date(b.CreatedOn); // descending
            })
            res.send(usernotes)
        } catch (err) {
            res.status(401).send({ message: err.message })
        }
    })

// .delete('/DeleteAllNotes', async (req, res) => {
//     try {
//         const usernotes = await UserNotes.addnotes(req.body)
//         res.send(usernotes)
//     } catch (err) {
//         res.status(401).send({ message: err.message })
//     })
// .delete('/DeleteSpecificNote', async (req, res) => {
//     try {
//         const usernotes = await UserNotes.addnotes(req.body)
//         res.send(usernotes)
//     } catch (err) {
//         res.status(401).send({ message: err.message })
//     })
module.exports = router