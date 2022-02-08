const express = require("express");
const http = require("http");
const path = require("path");
const bodyPaser = require('body-parser');
//const socketio = require("socket.io");
const cors = require("cors");

const mongoose = require('mongoose');
const Quiz = require('../schemas/quiz');
const Room = require("../schemas/room");
const { resolve } = require("path");
const ObjectId = require('mongodb').ObjectId;

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

// 룸 정보 불러오기 
func.loadRoom= function(roomPin){
    console.log('[db_func] loadRoom 함수 호출, roomPin : ', roomPin);
 
    return new Promise((resolve)=>{
        Room.find({roomPin: roomPin}, function(error, room){
            console.log('--- loadRoom ---');
            if(error){
                console.log(error);
            }else{
                resolve(room);
            }
        });
    });
}


// 방 생성 함수 
func.InsertRoom = function(roomData){
    console.log('INSERT Room 함수 호출');

    var newRoom = new Room(roomData);
    newRoom.save(function(error, data){
        if(error){
            console.log(error);
        }else{
            console.log('New Room Saved!');
        }
    });
}

// 유효한 방인지 확인하는  함수 
func.IsValidRoom = function(roomPin){
    console.log('IsValidRoom 함수 호출');

    return new Promise((resolve)=>{
        Room.find({roomPin: roomPin}, function(error, room){
            console.log('--- IsValidRoom ---');
            if(error){
                console.log(error);
          
            }else{
                // [ 여기 수정 필요]
                if (room.length != 0){
                    // console.log('room manager!! : ', room[0].manager);
                    resolve({permission : true, manager : room[0].manager });

                } else{
                    resolve({permission : false, manager : '' });
                }
            }
        });
    });
}

// 게임 시작 시 룸 정보 업데이트 
func.updateRoom = function(data){
    console.log('updateRoom 함수 호출 data.room', data.room, data.playerNum);

    return new Promise((resolve)=>{
        Room.find({roomPin: data.room}, function(error, room){
            console.log('--- IsValidRoom ---');
            if(error){
                console.log(error);
            }else{
              room[0]['players_num'] = data.playerNum;
              room[0]['players'] = data.users;

              console.log('수정된 room', room);
              // 수정 사항 저장 
              var updatedRoom = new Room(room[0]);
              console.log('새 room', updatedRoom)
              updatedRoom.save(function(error, data){
                // room.save(function(error, data){  
                    if(error){
                      console.log(error);
                  }else{
                      console.log('Room Updated!');
                      resolve(true);
                  }
              });

            }
        });
    });
}



// 특정 nickname 가진 퀴즈 추출 함수
func.FindQuiz = function(data){
    return new Promise((resolve)=>{
        console.log('Find Quiz 함수 호출');

        Room.find({roomPin: data}, function(error, room){
            console.log('--- IsValidRoom ---');
            if(error){
                console.log(error);
            }else{
                console.log('find quiz - room : ', room);
                var quiz_id = new ObjectId(room[0].quizID);
                console.log("quiz_uid : ", quiz_id);
            }

            Quiz.find({_id: quiz_id}, function(error, quiz_data){
                if(error){
                    console.log(error);
                }else{
                    console.log('find quiz - quiz: ', quiz_data);
                    quiz_data.forEach(function(element){
                        console.log("get quiz!!", element);
                        title = element.title;
                        manager = element.manager;
                        problems = element.problems;
            
                        quiz = {'title': title, 'manager': manager, 'problems': problems};
                        console.log('quiz list : ', quiz);
                        resolve(quiz);
                    });
                }
            });
        });
    })
}

module.exports = func;