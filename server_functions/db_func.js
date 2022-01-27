const express = require("express");
const http = require("http");
const path = require("path");
const bodyPaser = require('body-parser');
//const socketio = require("socket.io");
const cors = require("cors");

const mongoose = require('mongoose');
const Quiz = require('../schemas/quiz');

//===== Mongo DB ====
//MongoDB 연결
mongoose.connect('mongodb://localhost:27017/nodejs'); // 포트번호 뒤에 nodejs는 사용할 DB 이름 (현재는 nodejs DB를 사용)
var db = mongoose.connection;
// 연결 실패
db.on('error', function(){
    console.log('Connection Failed!');
});
// 연결 성공
db.once('open', function() {
    console.log('Connected!');
});


//==============================================================================
func = express();

// 데이터 INSERT QUIZ 함수
func.InsertQuiz = function(quizData){
    console.log('INSERT QUIZ 함수 호출');

    var newQuiz = new Quiz(quizData);
    newQuiz.save(function(error, data){
        if(error){
            console.log(error);
        }else{
            console.log('New QUIZ Saved!');
        }
    });

}

module.exports = func;