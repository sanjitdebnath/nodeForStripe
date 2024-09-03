const {user_register,user_login} = require("../db/user")
exports.register = async (req, res) => {
    try {
        const result = await user_register(req.body);
        if(result.error){
            res.json({status:false,message:result.error})
        }else{
            res.json({status:true,id:result.id,message:result.message,token:result.token})
        }
    } catch (error) {
        res.status(500).json({ status: "error", message: error });
    }
};

exports.login = async (req, res) => {
    try {
        const result = await user_login(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).send({ status: "error", message: "something went wrong" });
    }
};