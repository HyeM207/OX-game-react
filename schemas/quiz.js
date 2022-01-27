// schemas/quiz.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const quizSchema = new Schema({
    manager : { type : String, required : true },
    problem_num : { type : Number, required : true },
    problems : { type : Array },
    title : { type : String, required : true }
})


module.exports = mongoose.model('quizzes', quizSchema);