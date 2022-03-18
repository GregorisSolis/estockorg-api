const mongoose = require('../../dataBase')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
	name:{type: String, required: true},
	userName:{type: String, required: true, unique: true, lowercase: true},
	password:{type: String, required: true, select: false},
	permitType:{type: String, required: true},
	isActive:{type: Boolean, default: false},
	company:{type: String, required: true},
	createdAt: {type: Date, default: Date.now}
})

UserSchema.pre('save', async function(next){
	const hash = await bcrypt.hash(this.password, 10)
	this.password = hash

	next()
})

const User = mongoose.model('User', UserSchema)

module.exports = User

