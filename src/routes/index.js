const express = require("express");

const router = express.Router();

//. Controller

const { addUser, getUsers, getUser, updateUser, deleteUser } = require("../controllers/user");
const { addProduct, getProducts, getProduct, updateProduct, deleteProduct } = require("../controllers/product");
const { addCategory, getCategories, getCategory, updateCategory, deleteCategory } = require("../controllers/category");
const { addTransaction, getTransactions } = require("../controllers/transaction");
const { register, login, checkAuth } = require("../controllers/auth");

//. Middleware
const { auth } = require('../middlewares/auth')
const { uploadImage } = require('../middlewares/uploadImage')


//. Router

router.post('/user', addUser)
router.get('/users', getUsers)
router.get('/user/:id', getUser)
router.patch('/user/:id', updateUser)
router.delete('/user/:id', deleteUser)

router.post("/product", auth, uploadImage('image'), addProduct)
router.get("/products", auth, getProducts)
router.get("/product/:id", auth, getProduct)
router.patch("/product/:id", auth, uploadImage('image'), updateProduct)
router.delete("/product/:id", auth, deleteProduct)

router.post("/category", addCategory)
router.get("/categories", getCategories)
router.get("/category/:id", getCategory)
router.patch("/category/:id", updateCategory)
router.delete("/category/:id", deleteCategory)

router.post("/transaction", auth, addTransaction)
router.get("/transactions", auth, getTransactions)

router.post("/register", register)
router.post("/login", login)
router.get("/check-auth", auth, checkAuth)

module.exports = router;