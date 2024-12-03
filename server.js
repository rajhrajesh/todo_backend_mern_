const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
const app = express();
app.use(express.json())
const dotenv = require("dotenv");

dotenv.config();

const mongoURI = process.env.MangoURI
const port = process.env.PORT || 5000

app.use(cors());

mongoose.connect(mongoURI).then(() => {
    console.log("DB Connected")
}).catch((err) => {
    console.log(err)
})

const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    }, description: String
})

const todoModel = mongoose.model('Todo', todoSchema);

app.get('/todos', async (req, res) => {
    try {
        const todos = await todoModel.find();
        res.json(todos);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
})

app.post('/todos', async (req, res) => {
    console.log(req.body);
    const { title, description } = req.body;
    try {
        const newTodo = new todoModel({ title, description })
        await newTodo.save();
        res.status(201).json({ newTodo });
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message: err })
    }
})




app.put('/todos/:id', async (req, res) => {

    try {
        const { id } = req.params;
        const { title, description } = req.body;
        const updatedTodo = await todoModel.findByIdAndUpdate(
            id,
            { title, description },
            { new: true }
        )

        if (!updatedTodo) {
            return res.status(404).json({ message: "todo not found" })
        }
        res.json(updatedTodo)

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
})



app.delete('/todos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleteTodo = await todoModel.findByIdAndDelete(id);
        if (!deleteTodo) {
            return res.status(404).json({ message: `Todo with id ${id} not found` });
        }
        res.status(204).json({ message: `_this ${id} deleted successfully` }).end();
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message })
    }

})


app.listen(port, () => {
    console.log(`Server inititate running on this port_ ${port}`)
});
