const mongoose = require("mongoose");
const { ObjectId } = mongoose;
const Schema = mongoose.Schema;

const user = new Schema({
    email: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    linkedId: {
        type: ObjectId,
        ref: "contact",
    },
    linkPrecedence: {
        type: String,
        enum: ["Secondary", "Primary"],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    deletedAt: {
        type: Date,
        default: null,
    },
});
const User = mongoose.model("User", user);
module.exports = User;
