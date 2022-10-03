const { Schema, model } = require("mongoose")

const schema = new Schema({
    
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    displayAvatarURL: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    is_verified: {
        type: Boolean,
        default: false
    },
    is_admin: {
        type: Boolean,
        default: false
    }

})

module.exports = model("user", schema)