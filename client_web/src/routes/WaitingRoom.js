import React, { useEffect, useState } from 'react';
import {Menu, socket, Blocker} from '../components';
import {useNavigate, useLocation} from 'react-router-dom';
import { usePrompt } from '../components/Blocker';

const WaitingRoom = () => {

  const location = useLocation();
  // console.log('WaitingRoom에서 호출됨');
  // console.log('[WaitingRoom] location: ', location); 
  
  // 닉네임 설정
  const nickname = location.state.nickname;
  const room = location.state.room;
  const manager = location.state.manager;
  const navigate = useNavigate();
  console.log('[WaitingRoom] manager: ', manager);

  
  const [chats, setchats] = useState([]);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [playerNum, setPlayerNum] = useState(0);
  const [users, setUsers] = useState([]);
  // const [manager, setManager] = useState('');
  const [minPlayer, setMinPlayer] = useState(0);
  const [maxPlayer, setMaxPlayer] = useState(0);
  const [limitedTime, setLimitedTime] = useState(0);
  const [message, setMessage] = useState('');

  // 뒤로 가기 막기
  
  

  // const MyComponent = () => {
  //   const formIsDirty = true; // Condition to trigger the prompt.
  //   usePrompt( 'Leave screen?', formIsDirty );
  //   return (
  //     <div>Hello world</div> 
  //   );
  // };
  // usePrompt('현재 페이지를 벗어나시겠습니까?', true);

   // 랜더링 및 값 바뀔 때마다 호출
  useEffect(async() => {
    // socket.emit('add user', nickname);
     
      // socket.emit('add user', {nickname: nickname, room: room});

      // socket.on("loadRoom", (data) => {
      //   console.log('[loadRoom] data', data);
      //   setMinPlayer(data[0].minPlayer);
      //   setMaxPlayer(data[0].maxPlayer);
      //   setLimitedTime(data[0].limitedTime);
      //   setManager(data[0].manager);
      // });
      
      socket.on('game play',  ()=> {
        console.log('[socket-game play]');
        navigate('/dynamic-web_OXGame/quizRoom', {state: {nickname : nickname, room: room, playerNum: playerNum, manager: manager}}); // (정수) 게임시작 - 파라미터 조정
      });

      socket.on('login', (data) => {
        console.log('[socket-login]', data.numUsers);
        setUsers(data.users);
        setIsConnected(true);    
      });

      socket.on('user joined', (data) =>{
        console.log('[socket-user joined]', data.nickname);
        // setNumber(data.numUsers);
        setPlayerNum(data.numUsers)
        setUsers(data.users);
        setchats(chats.concat(`${data.nickname} joined`));
      })
      
      socket.on('user left', (data) => {
        console.log('!![socket-user left]', data.nickname);
        // 처리 필요
        // setUsers(users.filter((user) => user !== data.nickname));
        setUsers(data.users);
        setPlayerNum(data.numUsers)
        setchats(chats.concat(`${data.nickname} left`));
      });


      socket.on('disconnect', () => {
        console.log('!![socket-disconnect]');
        setIsConnected(false);
  });
    //  socket.on('new message', (data) => {
    //    setchats(chats.concat(`${data.username} : ${data.message}`));
    //  });
     return () => {
          socket.off('login');
          socket.off('disconnect');
          socket.off('loadRoom');
          socket.off('join');
     };
   });

  // 한번만 호출
  useEffect(() => {

    socket.emit('add user', {nickname: nickname, room: room, manager: manager});

    socket.on("loadRoom", (data) => {
      console.log('[loadRoom] data', data);
      setMinPlayer(data[0].minPlayer);
      setMaxPlayer(data[0].maxPlayer);
      setLimitedTime(data[0].limitedTime);
      // setManager(data[0].manager);
    });

  },[]);


  const ONCHANGE = (e) =>{
  //  setNickName(e.target.value);
  }

  const GAMESTART = () =>{
    console.log('[WatingRoom] GAMESTART - room', room);
    console.log('[WatingRoom] GAMESTART - users', users);

    if (playerNum < minPlayer){
      setMessage("PlayerNum must be greater than 'minPlayer'");
      setTimeout(() => {
        setMessage('');
      }, 2000)
    }
    else{
      let usersExcecptM  = users.filter((element) => element !== manager);
      console.log('[WaitingRoom] GAMESTART - usersExcecptM', usersExcecptM);
      socket.emit('game start', {room : room, playerNum: playerNum, users: usersExcecptM});
    }
  }

  return (
    <div style={{ width : "100%"}}>
      <Menu />
      
      <div class="card bg-secondary mb-3" style={{ width: "25%", height : "13rem", float: "left"}} >
        <div class="card-header">My Info</div>
        <div class="card-body">
          <h4 class="card-title">{nickname}</h4>
          <p class="card-text"> Connected: { '' + isConnected } </p>
          <p class="card-text"> socket ID: {`(${socket.id})` }</p>
        </div>
      </div>

      <div class="card bg-light mb-3" style={{ width: "25%", height : "13rem", float: "right"}} >
        <div class="card-header">Log</div>
        <div class="card-body" style={{ "overflow-y" : "scroll"}}>
          <h4 class="card-title">Entering</h4>
          {chats.map((val, index) => {
                  return (<p key={index}>{val}</p>);
          })}
        </div>
      </div>

      <div class="card text-white bg-primary mb-3"style={{  width: "50%", height : "13rem"}}  >
        <div class="card-header">Room Info</div>
        <div class="card-body">
          <h4 class="card-title">{room}</h4>
          <p class="card-text">현재인원 / 최소인원 / 최대인원: { '' + playerNum +' 명 /  ' + minPlayer + ' 명 / ' + maxPlayer + ' 명'}</p>
          <p class="card-text">limitedTime: { '' + limitedTime }</p>
          <p class="card-text">manager: { '' + manager }</p>
        </div>
      </div>

   
      <div style={{ "margin-left" : "15%", "margin-right" : "15%"}}>
        <h2> Player List </h2>
        <div style={{ "overflow-y" : "scroll"}}>
          {users.map((user, index) => {
              return (<button  key={index}  type="button" class="btn btn-outline-dark" style={{ float: "left", margin : "5px"}}>{user}</button>);
          })}
          {/* <p>플레이어 목록: {''+ users }</p> */}
        </div>

      </div>

      <div style={{  position: "absolute", top: "85%", left: "50%", transform: "translate(-50%,-50%)"}}>
        <p class="text-danger">{message}</p>
      </div>
      { manager == nickname && <button onClick={GAMESTART} type="button" class="btn btn-success" style={{  position: "absolute", top: "90%", left: "50%", transform: "translate(-50%,-50%)"}} >게임 시작</button>}
   

    </div>
    
  );

};

export default WaitingRoom;