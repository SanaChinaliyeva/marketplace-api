const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;


const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: async function(value) {
                if(!this.isModified('username')) return true;

                const user = await User.findOne({username: value});
                if(user) throw new Error();
            },
            message: "Username must be unique!"
        }
    },
    password: {
        type: String,
        required: true
    },
    token: String,
    display_name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    }
});

UserSchema.pre('save', async function(next) {

    if(!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    const hash = await bcrypt.hash(this.password, salt);

    this.password = hash;

    next();
});

UserSchema.set('toJSON', {
     transform: (doc, ret) => {
         delete ret.password;
         return ret;
     }
});

UserSchema.methods.checkPassword = function (password) {
    return bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
