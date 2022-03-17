const mongoose = require('mongoose')
const urlDB = require('../config/database.json')

mongoose.connect(urlDB.urlDB, {useNewUrlParser: true, useUnifiedTopology: true})
mongoose.Promise = global.Promise

module.exports = mongoose
