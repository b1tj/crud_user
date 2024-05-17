const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 8080

const schemaData = mongoose.Schema(
    {
        name: String,
        email: String,
        mobile: String,
        address: String,
    },
    {
        timestamps: true,
    }
)

const userModel = mongoose.model('user', schemaData)

// Get all users
// http://localhost:8080/
app.get('/', async (req, res) => {
    const data = await userModel.find({})

    res.json({ sucess: true, data: data })
})

// Create user
// http://localhost:8080/create
/**
 * {
 *     name,
 *     email,
 *     mobile,
 *     address,
 * }
 */
app.post('/create', async (req, res) => {
    console.log(req.body)
    const data = new userModel(req.body)
    await data.save()

    res.send({ sucess: true, message: 'Data saved sucessfully', data: data })
})

// Update user
// http://localhost:8080/update
/**
 * {
 *     name,
 *     email,
 *     mobile,
 *     address,
 * }
 */
app.put('/update', async (req, res) => {
    const { _id, ...rest } = req.body
    const data = await userModel.updateOne({ _id: req.body._id }, rest)

    res.send({ sucess: true, message: 'Data updated sucessfully', data: data })
})

// Delete user
// http://localhost:8080/delete/id
app.delete('/delete/:id', async (req, res) => {
    const id = req.params.id
    console.log(id)

    const data = await userModel.deleteOne({ _id: id })
    res.send({ sucess: true, message: 'Data deleted sucessfully', data: data })
})

mongoose
    .connect('mongodb://localhost:27017/TestDB')
    .then(() => {
        console.log('Connected to DB')
    })
    .catch((err) => console.log(err))

app.listen(PORT, () => console.log('Server is running...'))
