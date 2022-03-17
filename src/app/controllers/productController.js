const express = require('express')
const Product = require('../models/product')
const authMiddleware = require('../middlewares/auth')

const router = express.Router()
router.use(authMiddleware)

//SHOW ALL PRODUCT
router.get('/list-product', async (req,res)=>{
	try{
		const products = await Product.find()
		return res.send({ products })
	}
	catch(err){
		return res.status(400).send({ error: "Erro in loading products."})
	}
})

//SHOW LIST OF PRODUCT BY
router.get('/product-by/:code', async (req, res) =>{
	try{
		const product = await Product.find({ companyCode: req.params.code })
		return res.send({product})
	}
	catch(err){
		return res.status(400).send({ error: "Erro in show product by. " + err })
	}
})

//ADD PRODUCT
router.post('/add-product', async (req,res) =>{
	try{
		const product = await Product.create(req.body)
		return res.send({ product })
	}
	catch(err){
		return res.status(400).send({ error: "Erro in adding the product. "})
	}
})

//EDIT PRODUCT

router.put('/edit-product/:productID', async(req,res)=>{
	try{
		const product = await Product.findByIdAndUpdate(req.params.productID,{...req.body, user: req.userID},{new: true})
		return res.send({ product })
	}
	catch(err){
		return  res.status(400).send({ error: "Erro in editing product." })
	}
})

//DELETE PRODUCT
router.delete('/delete-product/:productID', async(req,res)=>{
	try{
		await Product.findByIdAndRemove(req.params.productID)
		return res.send()
	}
	catch(err){
		return res.status(400).send({ error: "Erro delete product." })
	}
})

module.exports = app => app.use('/product', router)