// 이 파일 앱과 웹 공동으로 사용되는 게임 서버 코드
// server_functions 에 함수 정의해서 여기에 import해서 써도 됨
// 이 곳은 클라이언트(앱, 웹)로부터 json 형식이나 문자열, 정수 등의 데이터를 받아와 게임 룰에 기반하여 데이처 처리 후

// 먄약 데이터를 보내준 클라이언트 한명에게만 답을 할꺼면 emit

// 모두에게 데이터를 공유할 경우 일단 api 사용이라고 표현해주면 됨
// ** 원래 io.to(room).emit 하면 해당 room에 있는 모든 사용자들한테 전송된다고 알고 있을 수도 있지만
// 실제는 이런식("http://graykick.tistory.com/5")으로 동작되기 때문에 위의 코드는 쓰지 말고 저 코드가 필요할 때는 api 사용이라고 표현 부탁

// 다만!! 하나의 프로세스만 이용해서 테스트할때는 io.to(room).emit 써도 되지만 어차피 다 없애야 되는 걸 염두하고 테스트용으로만 썼으면 좋겠다.( 미리 프론트 만들 용도로만 ?)

//===지금은 당장 꼭 엄청 중요한 얘기는 아니지만 참고용 =====
// 최종 생각하는 과정은 하나의 게임이 시작될 때 api를 통해 사용자들이 join할 room 단위로 redis에 channel도 같이 생성해주고 (물론 진행 중인 게임이 종료되면 channel도 바로 삭제)
// room에 join할 때는 api를 통해 redis의 특정 채널을 구독하도록 하고
// 데이터를 공유할 때는 api 파라미터로 데이터를 공유받아야될 대상과 데이터를 써주면 api내에서 pub.sub 매커니즘 기준으로
// publish를 해주어 구독한 클라이언트들에게만 데이터를 뿌려줄 수 있도록 생각만 해놓음

//가능하면 백엔드 모든 코드를 여기에 하지 말고 server_functions에 모듈화해서 여기는 최대한 간소화될 수 있게 부탁

// socket.io 대표 기능을 간단히 적어놓았고 게임 룰에 맞춰 응용하고 주의해야할 점은
// - firebase에 꼭 저장해야 할 정보인지 
// - client와 통신하는 부분 즉, socket.io 쓰는 부분 
//    - client에서 데이터를 받아와 게임 룰에 따라 처리하는 부분은 크게 바뀔일이 없지만
//    - 한명의 client가 자기와 함께 게임하는, 다른, client들 모두에게 데이터 공유 시는 api를 사용해야 하므로 
//    지금 당장 테스트용 코드와 (//이부분 api요청) 설명을 꼭 같이 써주길 바람
//    - 또한 room이름 고유하게! 끝나면 소속되어 있는 모든 클라이언트 leave되게! 쓸데없이 남아있거나 떠도는 room이 없게
//     => 그래서 사용자가 leave를 해서 room에서 나가는 게 아니라 백엔드에서 퀴즈가 끝났다 싶으면 강제로 모든 클라이언트가 room에서 leave하도록 해야될 것 같음
//        해당 코드는 찾아보면 있는 것 같음 (ex) io.of(namespace).in(room).socketsleave(room)) 
//        socket.io버전에 따라 코드가 조금씩 다르니 한번 찾아보길 바람
//        그리고 그곳에 api : redis channel 삭제나 모든 클라이언트 구독 취소 주석 같이 작성


// 주석 안해주면 내가 찾아서 할 때 너무 오래 걸릴 것 같아서 부탁해..ㅜㅜ
// api 빨리 만들껩... 
// 일단 구조는 오늘 싹 다 갈아엎어서 기존 코드는 게임 서버 부분 일부 못쓰게 되서 일단 지금 구성도로 하면 웹 앱 공통으로 쓸 수 있는 서버 코드는 여기에 있고 웹 클라이언트 코드는 react로 있으며 앱 클라이언트 코드는 있다고 가정
// 안드로이드 클라이언트 코드는 좀 짜놨었는데 그거랑 상관없이 게임 서버 자체는 이론적으로 공용 서버 여야 하기 때문에 구조는 이렇게 해야할 것 같음 ( 서버에 클라이언트 코드가 아예 안들어가도록 )
// nodejs router 기능이 react dom router?기능으로로 가는 등 react로 클라이언트를 구현

// 마지막?으로 지금 socket.disconnect 안 넣어놨는데 클라이언트가 게임 서버와 통신이 이제 더 이상 안할 경우
// 해당 사이트에서 나갈 경우 socket이 disconnect 되도록만 해주면 될 것 같음

const url = require('url');
const func = require('./server_functions/db_func');
const async = require('async');

module.exports = (io) => {
    
    var gameserver = io.of("dynamic-web_OXGame");
    
    let numUsers = 0; // 방 인원
    let users = [];

    var roundChoice = [];  // 라운드 별 선택한 답 {nickname: string, round: int, answer: string}
    var rank = []; // 순위 닉네임 저장 {rank: int, nickname: string, count: int}
    var outList = [];
    var playerList = [];
    
    gameserver.on('connection', (socket) => {
        console.log("io-handler.js socket connect!!");
        console.log("socketid : "+ socket.id); 
        // client마다 소켓 id가 다르다. 
        // 따라서 사용자 이름과 소켓 id를 해시값으로 저장해도 됨
        const {ns} = url.parse(socket.handshake.url, true).query;
        console.log(ns);
        
        
        // =========== Waiting Room ===================
        let addedUser = false; // added 유저 경우 
       

        // when the client emits 'add user', this listens \and executes
        socket.on('add user', (data) => {
            playerList = [];  // 임시로 정수 코드에서 필요함 (추후엔 db로 가져오거나 해야 할 것)

            console.log('[add user] add user 호출됨 addedUser : ', addedUser, 'user : ', data.nickname);
            console.log('[add user] data: ',data);
            if (addedUser) return;

            // // we store the username in the socket session for this client
            //var nickname = data.nickname;
            socket.nickname = data.nickname;
            var room = data.room;
            ++numUsers;
            users.push(socket.nickname); //유저 목록에 추가 
            console.log('[add user] numUseruse : ',numUsers);
            console.log('[add user *] users : ',users);
            console.log("[add user +] : " + socket.nickname  + " id:" +socket.id+" num : "+numUsers+ " room:"+ data.room);
            // console.log("[add user +] : " + socket.nickname + " id:" +socket.id);
            addedUser = true;

            
            socket.join(room);
            // console.log('!!!!!! ', gameserver.sockets.adapter.rooms[room]); 
            // gameserver.sockets.clients(room)

            // Room 정보 전달 
            func.loadRoom(data.room).then(function (room){
                console.log('[socket-loadRoom] room:',room);
                socket.emit('loadRoom',room);
                console.log('룸 정보 전송 완료');
            });

            // 사용자 로그인 알림
            gameserver.in(room).emit('login', {
                numUsers: numUsers,
                users : users
            });

            // 새 사용자 입장 알림 
            //  echo globally (all clients) that a person has connected
            gameserver.in(room).emit('user joined', {
                nickname: socket.nickname,
                numUsers: numUsers,
                users : users
            });

        });



        // WaitingRoom에서 관리자가 게임 시작 버튼을 눌렀을 경우
        socket.on('game start', (data) => {
            console.log('[game start] data: ', data);

            func.updateRoom(data).then(function (result){
                console.log('[socket-IsValidRoom-Then] result:',result);  
                gameserver.in(data.room).emit('game play');
            });
        })

        // when the user disconnects.. perform this
        socket.on('disconnect', (data) => {
            if (addedUser) {
            --numUsers;
            // 추가 필요
            console.log("[disconnected] : "+socket.id+" num : "+numUsers);
            
            // echo globally that this client has left
            socket.emit('user left', {
                nickname: socket.nickname,
                numUsers: numUsers
            });

            socket.leave(data.room);
            }
        });
        

        socket.on("test", (data) => {
            console.log(data);
            socket.emit("server", "hello22");
        });
        
        socket.on("join", (data) => { // 이 함수는 클라이언트 단에서 leave를 이름으로 해당 클라이언트 정보를 담아 emit을 해주면 해당 클라이언트를 room에 join 해주는 함수임
            console.log("[join]", data);
            //socket.join(data.room);

            // data를 출력했을 때 {"troom" : 12345, "username" : "mini"} 라고 한다면
            // socket.io에는 namespace 하위 개념으로 room이 있음
            // room은 게임 그룹 단위로 여기면 될 것 같음 (예를 들어 어몽어스 한 방)
            // room이름(data.room)을 고유번호5자리 등으로 하여 참가자들이 join할 때 마다 즉, 여기 함수로 들어올 때마다
            // firebase에 사용자 이름(data.username)을 해당 룸 하위에 추가하면 될 것 같음
    
        });

        socket.on("leave", (data) => { // 이 함수는 클라이언트 단에서 leave를 이름으로 해당 클라이언트 정보를 담아 emit을 해주면 해당 클라이언트를 room에서 leave해주는 함수임
            console.log(data);
            //socket.leave(data.room);

            // room이름(data.room)을 고유번호5자리 등으로 하여 참가자들이 leave할 때 마다 즉, 여기 함수로 들어올 때마다
            // firebase에 사용자 이름(data.username)을 해당 룸 하위에 제거해주면 될 것 같음
            
        });
        // 그리고 만약 해당 퀴즈가 끝나면 Redis channel 삭제 예정


        // =========== HOME  ===================
        socket.on("isValidRoom", (room) => {
            console.log('[socket-isValidRoom] room:',room);

            func.IsValidRoom(room).then(function (permission){
                console.log('[socket-IsValidRoom-Then] permission:',permission);
                socket.emit('room permission',{
                    permission: permission,
                    room: room
                });
    
            });  
        });

        // ============ QUIZ INSERT ==================
        socket.on("quiz", (data) => {
            console.log("서버에서 quiz 수신함");
            console.log(data);
            console.log(data.problems[0]);
            func.InsertQuiz(data);
        });


        // ===== CreateRoom =====
        socket.on("loadQuiz", (data) =>{
            console.log('[socket-loadQuiz] 호출됨');

            func.loadQuiz(data.nickname).then(function (quizzes){
                console.log('[socket-loadQuiz] quizzes:',quizzes);
                socket.emit('showQuiz',quizzes);
                console.log('추출된 퀴즈들 전송 완료');
            });
        });


        socket.on("createRoom", (room) =>{
            console.log('[socket-createRoom] 호출됨');
            // console.log('수정 전 ', room);
            room['creationDate'] = nowDate();
            room['roomPin'] = randomN();
            // console.log('수정 후 ', room);
           func.InsertRoom(room);

           socket.emit('succesCreateRoom', {
                roomPin: room.roomPin
            });
        });

        // =========== EXTRACT QUIZ ===================
        socket.on("nickname", (data) => {
            console.log("서버에서 nickname 수신함(퀴즈 추출 위함)");
            console.log('nickname: ', data);

            func.ExtractQuiz(data).then(function (s_quizzes){
                socket.emit('myQuizzes',s_quizzes);
                console.log('추출된 퀴즈들 전송 완료');
            });
            
        });

        // =========== DELETE QUIZ ===================
        socket.on("drop_ID", (data) => {
            console.log("삭제할 퀴즈 ID 수신", data);
            func.DeleteQuiz(data);
            
        });



        // =========== Find QUIZ ===================
        socket.on("get quiz", (data) => {
            console.log("서버에서 퀴즈 추출해 전송");
            console.log('io-handler find quiz : ', data);
            roundChoice = [];
            rank = [];
            outList = [];
            var manager = ""

            func.loadRoom(data.room).then(function (room_data){
                console.log('get quiz - room data : ', room_data);
                console.log('get quiz - room manager : ', room_data[0].manager);
                manager = room_data[0].manager;
            });

            if (manager != data.nickname){
                console.log("manager : ", manager);
                console.log("data.nickname : ", data.nickname);
                console.log("manager != data.nickname : ", manager != data.nickname);
                playerList.push(data.nickname);
                console.log("player lsit 추가 : ", playerList);
            }

            gameserver.in(data.room).emit('playerList', playerList);

            func.FindQuiz(data.room).then(function (quiz){
                socket.emit('quiz', quiz);
                console.log('findQuiz quiz : ', quiz);
                console.log('추출된 퀴즈들 전송 완료');
            });
        });

        // 답 선택 (닉네임으로 중복 제거를 하였는데 id가 더 좋을 수도 있을 것 같음)
        socket.on("choiceAnswer", (data) => {
            console.log("클라이언트에서 서버로 선택한 답 전송");
            console.log("choiceAnswer 받은 데이터 : ", data);
            console.log("choiceAnswer room id : ", data.room);
            console.log("choiceAnswer 받은 데이터의 닉네임 : ", data.nickname);
            console.log("시작 시 roundChoice : ", roundChoice);

            const idx = roundChoice.findIndex(function(prev) {return prev.nickname === data.nickname});
            console.log("삭제할 데이터 : ", idx);
            if (idx != -1) {
                console.log("데이터 삭제하기");
                roundChoice.splice(idx, 1);
            }

            console.log("삭제 후 roundChoice : ", roundChoice);

            roundChoice.push(data);
            console.log("push까지 한 roundChoice : ", roundChoice);
            gameserver.in(data.room).emit('usersChoice', roundChoice);
            // socket.emit('usersChoice', roundChoice);
        });

        // 탈락한 인원 roundChoice에서 제외 시키기
        socket.on("outQuiz", (data) => {
            console.log("탈락한 사람의 데이터 : ", data);
            console.log("탈락한 사람의 닉네임 : ", data.nickname);
            rank.push(data);
            outList.push(data.nickname);

            // 데이터가 삭제 안 되어서 한 것임 (추후 삭제해도 됨 혹은 id로 구분하기)
            var idx = roundChoice.findIndex(function(prev) {return prev.nickname === data.nickname});
            if (idx != -1) {
                console.log("데이터 삭제하기 : ", idx);
                roundChoice.splice(idx, 1);
            }

            // 데이터가 삭제 안 되어서 한 것임 (추후 삭제해도 됨 혹은 id로 구분하기)
            idx = playerList.findIndex(function(prev) {return prev === data.nickname});
            if (idx != -1) {
                console.log("데이터 추가하기 : ", idx);
                playerList.splice(idx, 1);
            }

            console.log("삭제 후 리스트 : ", roundChoice);
            gameserver.in(data.room).emit('usersChoice', roundChoice);

            console.log("삭제 후 playerList 리스트 : ", playerList);
            gameserver.in(data.room).emit('playerList', playerList);

            console.log("삭제 후 outList 리스트 : ", outList);
            gameserver.in(data.room).emit('outList', outList);
        });

        socket.on("endQuiz", (data) => {
            console.log("퀴즈가 종료 됨 room id : ", data);
            console.log("퀴즈 종료 랭크 : ", rank);

            //현재 객체 배열을 정렬, count가 큰 객체부터
            rank.sort(function (a, b) { 
                return a.count > b.count ? -1 : a.count < b.count ? 1 : 0;  
            });

            console.log("정렬 후 rank : ", rank);
            gameserver.in(data).emit('rankQuiz', rank);
        });
    })


    function randomN(){
        var randomNum = {};
        //0~9까지의 난수
    
        randomNum.random = function(n1, n2) {
            return parseInt(Math.random() * (n2 -n1 +1)) + n1;
        };
    
        var value = "";
        for(var i=0; i<5; i++){
            value += randomNum.random(0,9);
        }
        return value;
        
    };


    function nowDate(){
        var today = new Date();
        var year = today.getFullYear();
        var month = ('0' + (today.getMonth() + 1)).slice(-2);
        var day = ('0' + today.getDate()).slice(-2);
        
        var today = new Date();   
        var hours = ('0' + today.getHours()).slice(-2); 
        var minutes = ('0' + today.getMinutes()).slice(-2);
        var seconds = ('0' + today.getSeconds()).slice(-2); 
        
        var dateString = year + '-' + month  + '-' + day;
        var timeString = hours + ':' + minutes  + ':' + seconds;
    
        var now_date = dateString + " " + timeString;
        return now_date;
    };
}