const express = require("express");
const http = require("http");
const path = require("path");
const bodyPaser = require('body-parser');
const socketio = require("socket.io");
const cors = require("cors");

const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const options = {
    cors: true,
    origin: ['http://localhost:7000/dynamic-web_OXGame/'],
};
const io = socketio(server, options);

// const io = socketio(server,{
//     cors: {
//         origin: 'https://192.168.35.25:7000',
//         methods: ["GET", "POST"]
//     }
// });

require('./io-handler')(io);

app.use(cors());
app.use(bodyPaser.json());
app.use(bodyPaser.urlencoded({extended: false}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client_web/build')));

app.get('*', function(req, res){
    res.sendFile(path.join(__dirname, '/client_web/build/index.html'));
})

server.listen(process.argv[2]);
console.log(process.argv[2] +' Server Started!! ');


///===== Mongo DB ====
// 1. 모듈 가져오기 (맨 위에 있음)
const Quiz = require('./schemas/quiz');
// 2. testDB 세팅
//mongoose.connect('mongodb://root:root@localhost:27017/nodejs');  // 포트번호 뒤에 nodejs는 사용할 DB 이름
mongoose.connect('mongodb://localhost:27017/nodejs'); // 포트번호 뒤에 nodejs는 사용할 DB 이름 (현재는 nodejs DB를 사용)
// 3. 연결된 DB 사용
var db = mongoose.connection;
// 4. 연결 실패
db.on('error', function(){
    console.log('Connection Failed!');
});
// 5. 연결 성공
db.once('open', function() {
    console.log('Connected!');
});


// 6. Schema 생성_Quiz 객체 생성해 값 입력
const problem1 = {
    question : "aaa",
    answer : "false",
    round : 1
}
const problem2 = {
    question : "BBBBBB",
    answer : "true",
    round : 2
}

const problemArr = [problem1, problem2];
console.log(problemArr);

// Quiz 객체로 바꿔줌
var newQuiz = new Quiz({manager:'Woo', problem_num:2, problems: problemArr, title:'TEST QUIZ'});


// 데이터 Insert  
// newQuiz.save(function(error, data){
//     if(error){
//         console.log(error);
//     }else{
//         console.log('Saved!')
//     }
// });