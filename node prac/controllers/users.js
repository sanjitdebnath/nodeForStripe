const user = require("../models/users")


const setUser = async (req, res) => {
    const body = req.body;
    try {
        const result = await user.create({
            firstName: body.first_name,
            lastName: body.last_name,
            email: body.email,
            gender: body.gender,
        })
        res.status(201).json({ "message": "user Created successfully", "id": result.id })
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).send({
                error: 'Email is already in use. Please use a different email address.',
            });
        }
        res.status(500).send({ error: 'An error occurred while registering the user.' });
    }
}

const getAllUser = async (req, res) => {
    const result = await user.find({});
    res.json(result);
}

const getUser = async (req, res) => {
    const id = req.params.id;
    try {
        const result = await user.findById(id);
        if (!result) {
            res.status(404).json({ "status": false, "message": "user not found" });
        }
        res.status(200).json({ "status": true, "data": result });
    } catch (err) {
        if (err.kind == "ObjectId") {
            res.status(400).json({ "status": false, "message": "Invalid User Id" });
        }
    }
}

const updateUser = async (req, res) => {
    const id = req.params.id;
    const body = req.body;
    try {
        const result = await user.findByIdAndUpdate(id, 
            { $set: body }, 
            { new: true });
        if (!result) {
            res.status(404).json({ "status": false, "message": "user not found" });
        }
        res.status(200).json({ "status": true, "data": result, "message": "user updated successfully" });
    } catch (err) {
        if (err.kind == "ObjectId") {
            res.status(400).json({ "status": false, "message": "Invalid User Id" });
        }
        res.status(500).json({
            status: false,
            message: "An error occurred while updating the user"
        });
    }
}

const deleteUser = async (req, res) => {
    const id = req.params.id;
    try{
        const result = await user.findByIdAndDelete(id);
        if (!result) {
            res.status(404).json({ "status": false, "message": "user not found" });
        }else{
            res.status(200).json({ "status": true, "data": result, "message": "user deleted successfully" });
        }
    }catch(err)
    {
        if (err.kind == "ObjectId") {
            res.status(400).json({ "status": false, "message": "Invalid User Id" });
        }
        res.status(500).json({
            status: false,
            message: "An error occurred while updating the user"
        });
    }
}




module.exports = {
    setUser,
    getAllUser,
    getUser,
    updateUser,
    deleteUser
}

