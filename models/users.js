const mongoose = require("mongoose")
const passportLocalMongoose = require("passport-local-mongoose")

const Schema = mongoose.Schema;

const UserModel = new Schema({
    username: String,
    password: String
})

UserModel.plugin(passportLocalMongoose)

module.exports = mongoose.model('users', UserModel)