const res = require('express/lib/response');
const mongoose = require('mongoose');
const quizzes = require('../schemas/quiz');

console.log("!!! get quiz !!!")

var quiz;

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


func = express();

// 데이터 INSERT QUIZ 함수
func.FindQuiz = function(){
    console.log('Find QUIZ 함수 호출');

    var newQuiz = new Quiz(quizData);
    newQuiz.save(function(error, data){
        if(error){
            console.log(error);
        }else{
            console.log('New QUIZ Saved!');
        }
    });

}


// 데이터 불러오기
quizzes.find(function(error, data){
    if(error){
        console.log(error);
    }else{
        console.log('find : ', data);
        data.forEach(function(element){
            // console.log("get quiz!!", element);
            title = element.title;
            problems = element.problems;

            quiz = {'title': title, 'problems': problems};
            // console.log('quiz list : ', quiz);
        });
    }
});

module.exports = quiz;