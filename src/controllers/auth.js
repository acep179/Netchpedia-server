const { user, profile } = require("../../models")
const Joi = require("joi")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {

    try {

        //. Melakukan validasi menggunakan Joi 
        const schema = Joi.object({
            name: Joi.string().min(3).required(),
            email: Joi.string().email().min(5).required(),
            password: Joi.string().min(4).required()
        })

        const { error } = schema.validate(req.body)

        if (error) {
            return res.status(400).send({
                error: {
                    message: error.details[0].message
                }
            })
        }

        //. Mengecek apakah sudah ada user dengan email yang diinputkan
        const userExist = await user.findOne({
            where: {
                email: req.body.email
            }
        })

        console.log(userExist);

        if (userExist) {
            return res.status(400).send({
                status: "failed",
                message: "Email sudah terdaftar"
            })
        }

        //. Mengenkripsi Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        //. Membuat Data User Berdasarkan Inputan
        const newUser = await user.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            status: "customer"
        })

        //. Membuat Data Profile untuk User
        await profile.create({ idUser: newUser.id })

        //. Membuat Token
        const token = jwt.sign({ id: user.id }, process.env.TOKEN_KEY);

        res.status(201).send({
            status: "success",
            message: "register success",
            data: {
                name: newUser.name,
                email: newUser.email,
                token
            }
        })

    } catch (error) {
        console.log(error);
        res.status(400).send({
            status: "failed",
            message: "server error"
        })
    }
};


exports.login = async (req, res) => {

    try {

        //. Validasi Form Menggunakan Joi 
        const schema = Joi.object({
            email: Joi.string().email().min(10).required(),
            password: Joi.string().min(4).required()
        })

        const { error } = schema.validate(req.body)

        if (error) {
            return res.status(400).send({
                error: {
                    message: error.details[0].message
                }
            })
        }

        //. Pengecekan apakah ada user berdasarkan email yang diinputkan
        const userExist = await user.findOne({
            where: {
                email: req.body.email
            },
            attributes: {
                exclude: ["createdAt", "updatedAt"],
            },
        })

        if (!userExist) {
            return res.status(400).send({
                status: "failed",
                message: "Email belum terdaftar"
            })
        }


        //. Pengecekan Password
        const isValid = await bcrypt.compare(req.body.password, userExist.password);

        if (!isValid) {
            return res.status(400).send({
                status: "failed",
                message: "credential is invalid",
            });
        }

        //. Pembuatan Token
        const token = jwt.sign({ id: userExist.id }, process.env.TOKEN_KEY);

        res.status(200).send({
            status: "success",
            data: {
                id: userExist.id,
                name: userExist.name,
                email: userExist.email,
                status: userExist.status,
                token
            }
        })

    } catch (error) {
        console.log(error);
        res.status(400).send({
            status: "failed",
            message: "server error"
        })
    }

};

exports.checkAuth = async (req, res) => {
    try {
        const id = req.user.id;

        const dataUser = await user.findOne({
            where: {
                id,
            },
            attributes: {
                exclude: ["createdAt", "updatedAt", "password"],
            },
        });

        if (!dataUser) {
            return res.status(404).send({
                status: "failed",
            });
        }

        res.send({
            status: "success...",
            data: {
                user: {
                    id: dataUser.id,
                    name: dataUser.name,
                    email: dataUser.email,
                    status: dataUser.status,
                },
            },
        });
    } catch (error) {
        console.log(error);
        res.status({
            status: "failed",
            message: "Server Error",
        });
    }
};
