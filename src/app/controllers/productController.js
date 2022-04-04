const express = require('express')
const authMiddleware = require('../middlewares/auth')
const Product = require('../models/product')

const router = express.Router()
router.use(authMiddleware)

//GET ALL PRODUCT BY COMPANY
router.get('/list-product/:nameCompany', async (req,res)=>{
	try{
		const products = await Product.find({ nameCompany: req.params.nameCompany })
		return res.send({ products })
	}
	catch(err){
		return res.status(400).send({ error: "Erro in loading products."})
	}
})

//GET LIST OF PRODUCT BY ID
router.get('/product-data/:ID', async (req, res) =>{
	try{
		const product = await Product.findById(req.params.ID)
		return res.send({product})
	}
	catch(err){
		return res.status(400).send({ error: "Erro in show product by. "})
	}
})

//GET LIST OF PRODUCT BY BARCODE
router.get('/product-info/:code', async (req, res) =>{

	try{
		const product = await Product.find({ barcode: req.params.code })
		return res.send({product})
	}
	catch(err){
		console.log(err)
		return res.status(400).send({ error: "Erro in show product by. "})
	}
})

//ADD PRODUCT
router.post('/add-product', async (req,res) =>{

	const { barcode, companyCode, nameCompany } = req.body

	try{

		if(await Product.findOne({ barcode }) || await Product.findOne({ companyCode })){
			if(await Product.findOne({ nameCompany })){
				return res.status(400).send({ error: "Product Duplicate."})
			}
		}

		const product = await Product.create({ ...req.body, addedBy: req.userId, editedBy: req.userId})
		return res.send({ product })
	}
	catch(err){
		return res.status(400).send({ error: "Erro in adding the product. "+ err})
	}
})

//EDIT PRODUCT

router.put('/edit-product/:productID', async(req,res)=>{
	try{
		const product = await Product.findByIdAndUpdate(req.params.productID,{...req.body, editedBy: req.userId},{new: true})
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