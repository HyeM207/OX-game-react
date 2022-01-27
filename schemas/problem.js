const mongoose = require('mongoose');

const { Schema } = mongoose;
const problemSchema = new Schema({
    round_num: {
        type: Number,
        required: true,
    },
    question: {
        type: String,
        required: true,
    },
    answer: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('problem', problemSchema);