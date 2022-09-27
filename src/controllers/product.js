const { user, product, category, category_product } = require("../../models");
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
            image: result.secure_url,
            idUser: req.user.id 
        })
        
        newProduct = JSON.parse(JSON.stringify(newProduct))

        // code here
        // const categoryData = await category.findOne({
        //     where: {
        //         id: categoryId,
        //     },
        // });

        // if (categoryData) {
        //     await category_product.create({
        //         idCategory: categoryData.id,
        //         idProduct: newProduct.id
        //     });
        // } else {
        //     const newCategory = await category.create({ name: categoryName });
        //     await category_product.create({
        //         idCategory: newCategory.id,
        //         idProduct: newProduct.id
        //     });
        // }
        
        let productData = await product.findOne({
            where: {
                id: newProduct.id,
            },
            include: [
                {
                    model: user,
                    as: "user",
                    attributes: {
                        exclude: ["createdAt", "updatedAt", "password"],
                    },
                },
                // {
                //     model: category,
                //     as: "categories",
                //     through: {
                //         model: category_product,
                //         as: "bridge",
                //     },
                //     attributes: {
                //         exclude: ["createdAt", "updatedAt"],
                //     },
                // },
            ],
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
        });
    }
};


exports.getProducts = async (req, res) => {
    try {

        const dataProduct = await product.findAll({
            include: [
                {
                    model: user,
                    as: "user",
                    attributes: {
                        exclude: ["createdAt", "updatedAt", "password"],
                    },
                },
                {
                    model: category,
                    as: "categories",
                    through: {
                        model: category_product,
                        as: "bridge",
                        attributes: [],
                    },
                    attributes: {
                        exclude: ["createdAt", "updatedAt"],
                    },
                },
            ],
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
            include: [
                {
                    model: user,
                    as: "user",
                    attributes: {
                        exclude: ["createdAt", "updatedAt", "password"],
                    },
                },
                {
                    model: category,
                    as: "categories",
                    through: {
                        model: category_product,
                        as: "bridge",
                        attributes: [],
                    },
                    attributes: {
                        exclude: ["createdAt", "updatedAt"],
                    },
                },
            ],
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

        await product.update(req.body,{
            where: {
                id
            }
        });

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
