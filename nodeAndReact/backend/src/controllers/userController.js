const { users,user_register,user_login,user_profile } = require('../models/db');

exports.users = async (req, res) => {
    try {
        const result = await users();
        // console.log(result);
        return;
        res.send({ status: "success", data: result });
    } catch (error) {
        console.error('Error fetching all media:', error);
        res.status(500).send({ status: "error", message: "Failed to fetch media" });
    }
};
// username: { type: String, required: true, unique: true },
// email: { type: String, required: true, unique: true },
// password: { type: String, required: true }

exports.register = async (req, res) => {
    try {
        const {username,password,email} = req.body;
        console.log(req.body)
        if (!username || !password || !email) {
            return res.status(400).send({ status: false, message: "Please fill all the fields" });
        }
        const result = await user_register(req.body);
        res.send({ status: result.status, message: result.message });
    } catch (error) {
        console.error('Error fetching all media:', error);
        res.status(500).send({ status: "error", message: "Failed to fetch media" });
    }
};

exports.login = async (req, res) => {
    try {
        const {username,password,email} = req.body;
        if (!username && !email || !password ) {
            return res.status(400).send({ status: false, message: "Please fill all the fields" });
        }
        const result = await user_login(req.body);
        if(result.token)
        {
            return res.status(200).send({ status: result.status, message: result.message,token:result.token });
        }else{
            return res.status(200).send({ status: result.status, message: result.message });
        }
    } catch (error) {
        console.error('Error fetching all media:', error);
        res.status(500).send({ status: "error", message: "Failed to fetch media" });
    }
};

exports.profile = async (req, res) => {
    try {
        if (!req.user.id) {
            return res.status(400).send({ status: false, message: "User not found" });
        }
        const result = await user_profile(req.user.id);
        if(result.status)
        {
            return res.status(200).send({ status: result.status, data: result.data});
        }else{
            return res.status(400).send({ status: result.status, message: result.message });
        }
    } catch (error) {
        console.error('Error fetching all media:', error);
        res.status(500).send({ status: "error", message: "Failed to fetch media" });
    }
};