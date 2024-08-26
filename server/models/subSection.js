const mongoose = require("mongoose");

const subSection = new mongoose.Schema({
    title:{
        type:String,
    },
    timeDuration:{
        type:String,
    },
    Descryption:{
        type:String,
    },
    videoUrl:{
        type:String,
    },
});

module.exports = mongoose.model("SubSection", subSection);