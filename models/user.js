const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

let UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true},
    resetPasswordToken: String,
    restePasswordExpires: Date
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);