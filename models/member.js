const mongoose = require('mongoose');
var Float = require('mongoose-float').loadType(mongoose);
const bcrypt = require('bcrypt');

// define the User model schema
const MemberSchema = new mongoose.Schema({
    username: { type: String, maxlength: 50, unique: true },
    email: { type: String, maxlength: 50, unique: true },
    phone: { type: String, maxlength: 50 },
    password: { type: String, maxlength: 32 },
    hash: { type: String, maxlength: 32 },
    fullname: { type: String, maxlength: 50 },
    created: { type: Date, default: new Date() },
    lastlogin: Date,
    user_verify_code: String
}, { collection: 'members' });


// Full text search
MemberSchema.index({ username: 'text', email: 'text', fullname: 'text' });

/**
 * Compare the passed password with the value in the database. A model method.
 *
 * @param {string} password
 * @returns {object} callback
 */
MemberSchema.methods.comparePassword = function comparePassword(password, callback) {
    bcrypt.compare(password, this.password, callback);
};


/**
 * The pre-save hook method.
 */
MemberSchema.pre('save', function saveHook(next) {
    const user = this;

    // proceed further only if the password is modified or the user is new
    if (!user.isModified('password')) return next();


    return bcrypt.genSalt((saltError, salt) => {
        if (saltError) { return next(saltError); }

        return bcrypt.hash(user.password, salt, (hashError, hash) => {
            if (hashError) { return next(hashError); }

            // replace a password string with hash value
            user.password = hash;

            return next();
        });
    });
});


module.exports = mongoose.model('Member', MemberSchema);