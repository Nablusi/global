const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        validate: {
            validator(value) {
                return /^[a-zA-Z\u0600-\u06FF]+$/.test(value);
            },
            message: props => `${props.value} is not a valid name. Please use only alphabetical characters.`,
        }

    },
    lastName: {
        type: String,
        validate: {
            validator: function (value) {
                return /^[a-zA-Z\u0600-\u06FF]+$/.test(value);
            },
            message: props => `${props.value} is not a valid name. Please use only alphabetical characters.`,
        },
    },
    username: {
        type: String,
        unique: true,
        validate: {
            validator: function (value) {
                return /^[a-zA-Z?-]+$/.test(value);
            },
            message: props => `${props.value} is not a valid name.`,
        },
    },
    email: {
        type: String,
        unique: true,
        validate: {
            validator: function (value) {
                return /^[a-zA-Z\d]?[a-zA-Z]+@[a-zA-Z]+\.[a-zA-Z]+$/.test(value);
            },
            message: props => `${props.value}  is not a valid email.`,
        },
    },
    password: {
        type: String,
    },
    contacts: [], 
    profile: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' },



});

const UserModel = mongoose.model('User', userSchema);

export default UserModel;