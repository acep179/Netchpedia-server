const { category } = require("../../models");

exports.addCategory = async (req, res) => {
    try {

        await category.create(req.body);

        res.send({
            status: "success",
            data: {category: req.body},
        });
    } catch (error) {
        console.log(error);
        res.send({
            status: "failed",
            message: "Server Error",
        });
    }
};


exports.getCategories = async (req, res) => {
    try {

        const dataCategory = await category.findAll({
            attributes: {
                exclude: ["createdAt","updatedAt"]
            }
        });

        res.send({
            status: "success",
            data: {categories: dataCategory},
        });
    } catch (error) {
        console.log(error);
        res.send({
            status: "failed",
            message: "Server Error",
        });
    }
};

exports.getCategory = async (req, res) => {
    try {

        const {id} = req.params

        const dataCategory = await category.findOne({
            where: {
                id
            },
            attributes: {
                exclude: ["createdAt","updatedAt"]
            }
        });

        res.send({
            status: "success",
            data: {category: dataCategory},
        });
    } catch (error) {
        console.log(error);
        res.send({
            status: "failed",
            message: "Server Error",
        });
    }
};

exports.updateCategory = async (req, res) => {
    try {

        const {id} = req.params

        await category.update(req.body,{
            where: {
                id
            }
        });

        res.send({
            status: "success",
            data: {category: req.body},
        });
    } catch (error) {
        console.log(error);
        res.send({
            status: "failed",
            message: "Server Error",
        });
    }
};

exports.deleteCategory = async (req, res) => {
    try {

        const {id} = req.params

        await category.destroy({
            where: {
                id
            }
        });

        res.send({
            status: "success",
            data: {id},
        });
    } catch (error) {
        console.log(error);
        res.send({
            status: "failed",
            message: "Server Error",
        });
    }
};
