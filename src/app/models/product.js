const mongoose = require('../../dataBase')

const ProductSchema = new mongoose.Schema({
    barcode:{type: String, required: true},
    nameCompany:{type: String, required: true, lowercase: true},
    companyCode:{type: String, required: true},
    name:{type: String, required: true},
    amount:{type: Number, required: true},
    color:{type: String, required: true},
    size:{type: String, required: true},
    model:{type: String, required: true},
    typeMaterial:{type: String, required: true},
    addedBy:{type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    editedBy:{type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    createdAt: { type: Date, default: Date.now },
})

const Product = mongoose.model('Product', ProductSchema)

module.exports = Product