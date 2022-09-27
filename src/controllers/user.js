const { user, profile } = require("../../models");
const bcrypt = require("bcrypt");


exports.addUser = async (req, res) => {
    try {
        await user.create(req.body);

        res.send({
            status: "success",
            data: {user: req.body},
        });
    } catch (error) {
        console.log(error);
        res.send({
            status: "failed",
            message: "Server Error",
        });
    }
};

exports.getUsers = async (req, res) => {
    try {

        const data = await user.findAll({
            include: {
                model: profile,
                as: "profile",
                attributes: {
                    exclude: ["createdAt", "updatedAt", "idUser"],
                },
            },
            attributes: {
                exclude: ["createdAt","updatedAt","idUser"]
            }
        });

        res.send({
            status: "success",
            data
        });
    } catch (error) {
        console.log(error);
        res.send({
            status: "failed",
            message: "Server Error",
        });
    }
};

exports.getUser = async (req,res) => {
    
    try {
        
        const {id} = req.params
        
        const data = await user.findOne({
            where: {
                id
            },
            include: {
                model: profile,
                as: "profile",
                attributes: {
                    exclude: ["createdAt", "updatedAt", "idUser"],
                },
            },
            attributes: {
                exclude: ["createdAt","updatedAt", "password"]
            }
        });
        
        res.send({
            status: "success",
            data
        });

        } catch (error) {
        console.log(error);
        res.send({
            status: "failed",
            message: "Server Error",
        });
        }
    }
    
exports.updateUser = async (req, res) => {
    try {

        const {id} = req.params

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);


        await user.update({
            ...req.body,
            password: hashedPassword
        },
        {
            where: {
                id
            }
        });

        res.send({
            status: "success",
            message: `Update user id: ${id} finished`,
            data: {user: {...req.body, password: hashedPassword}},
        });

    } catch (error) {
        console.log(error);
        res.send({
            status: "failed",
            message: "Server Error",
        });
    }
};

exports.deleteUser = async (req, res) => {
    try {

        const {id} = req.params

        await user.destroy({
            where: {
                id
            }
        });

        res.send({
            status: "success",
            message: `User with id ${id} has been deleted`,
        });
    } catch (error) {
        console.log(error);
        res.send({
            status: "failed",
            message: "Server Error",
        });
    }
};
