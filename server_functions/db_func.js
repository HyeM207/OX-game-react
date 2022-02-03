const express = require("express");
const http = require("http");
const path = require("path");
const bodyPaser = require('body-parser');
//const socketio = require("socket.io");
const cors = require("cors");

const mongoose = require('mongoose');
const Quiz = require('../schemas/quiz');
const room = require("../schemas/room");
const { resolve } = require("path");

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


// 특정 nickname 가진 퀴즈 추출 함수
func.ExtractQuiz = function(nickname){
    return new Promise((resolve)=>{
        console.log('Extract Quiz 함수 호출');
                
        Quiz.find({manager: nickname}, function(error, quiz){
            console.log('--- Read Quiz ---');
            if(error){
                console.log(error);
            }else{
                // 서버에서 클라이언트로 select 한 퀴즈들 전송
                resolve(quiz);
            }
        });
    }) 
}

// 특정 id 가진 퀴즈 삭제 함수
func.DeleteQuiz = function(q_id){
    console.log('Delete Quiz 함수 호출');

    Quiz.deleteOne({_id: q_id}, function(error){
        if(error) { console.log(error); }
        else { console.log('QUIZ 삭제 완료'); }
    });

}

// 퀴즈 목록 불러오기 
func.loadQuiz = function(nickname){
    console.log('[db_func] loadQuiz 함수 호출, settings : ', nickname);
 
    return new Promise((resolve)=>{
        Quiz.find({manager: nickname}, function(error, quizzes){
            console.log('--- Read Quiz ---');
            if(error){
                console.log(error);
            }else{
                resolve(quizzes);
            }
        });
    });
}


// 데이터 INSERT QUIZ 함수
func.InsertRoom = function(roomData){
    console.log('INSERT Room 함수 호출');

    var newRoom = new room(roomData);
    newRoom.save(function(error, data){
        if(error){
            console.log(error);
        }else{
            console.log('New Room Saved!');
        }
    });

}

module.exports = func;