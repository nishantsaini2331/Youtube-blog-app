const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        unique: true,
    },
    password: String,
    blogs :[
      {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Blog",
      }
    ],
    isVerify : {
        type : Boolean,
        default : false,
    }
});

const User = mongoose.model("User", userSchema);

module.exports = User;