const { product} = require("../../models");
const cloudinary = require('../utils/cloudinary');

exports.addProduct = async (req, res) => {
    try {
        
        const { categoryId, ...data } = req.body;

        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'dumbmerch',
            use_filename: true,
            unique_filename: false,
        });
        
        let newProduct = await product.create({
            ...data,
            image: result.secure_url
        })
        
        newProduct = JSON.parse(JSON.stringify(newProduct))
        
        let productData = await product.findOne({
            where: {
                id: newProduct.id,
            },
            attributes: {
                exclude: ["createdAt", "updatedAt", "idUser"],
            },
        });
    
        res.send({
            status: "success",
            data: {productData}
        })
    
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "failed",
            message: "Server Error",
            error
        });
    }
};


exports.getProducts = async (req, res) => {
    try {

        const dataProduct = await product.findAll({
            attributes: {
                exclude: ["createdAt","updatedAt","idUser"]
            },
        });

        data = JSON.parse(JSON.stringify(dataProduct));

        res.send({
            status: "success",
            products: data,
        });

    } catch (error) {
        console.log(error);
        res.send({
            status: "failed",
            message: "Server Error",
        });
    }
};

exports.getProduct = async (req, res) => {
    try {

        const {id} = req.params

        const dataProduct = await product.findOne({
            where: {
                id
            },
            attributes: {
                exclude: ["createdAt","updatedAt","idUser"]
            }
        });

        data = JSON.parse(JSON.stringify(dataProduct));

        res.send({
            status: "success",
            product: data,
        });
    } catch (error) {
        console.log(error);
        res.send({
            status: "failed",
            message: "Server Error",
        });
    }
};

exports.updateProduct = async (req, res) => {
    try {

        const {id} = req.params

        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'dumbmerch',
            use_filename: true,
            unique_filename: false,
        });

        await product.update(
            {
                ...req.body,
                image: result.secure_url
            },
            {
            where: {
                id
            }
        }
        );

        res.send({
            status: "success",
            data: {product: req.body},
        });
    } catch (error) {
        console.log(error);
        res.send({
            status: "failed",
            message: "Server Error",
        });
    }
};

exports.deleteProduct = async (req, res) => {
    try {

        const {id} = req.params

        await product.destroy({
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
