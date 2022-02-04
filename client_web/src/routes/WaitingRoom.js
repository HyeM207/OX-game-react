import React, { useEffect, useState } from 'react';
import {Menu, socket} from '../components';
import {useNavigate, useLocation} from 'react-router-dom';


const WaitingRoom = () => {

  const location = useLocation();
  console.log('WaitingRoom에서 호출됨');
  console.log('[WaitingRoom] location: ', location); 
  
  // 닉네임 설정
 
  const nickname = location.state.nickname;
  const room = location.state.room;
  const navigate = useNavigate();
  console.log('[WaitingRoom] nickname: ', nickname);

  
  const [chats, setchats] = useState([]);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [playerNum, setPlayerNum] = useState(0);
  const [users, setUsers] = useState([]);
  const [manager, setManager] = useState('');
  const [minPlayer, setMinPlayer] = useState(0);
  const [maxPlayer, setMaxPlayer] = useState(0);
  const [limitedTime, setLimitedTime] = useState(0);



   useEffect(async() => {
    // socket.emit('add user', nickname);
     
      socket.emit('add user', {nickname: nickname, room: room});

      socket.on("loadRoom", (data) => {
        console.log('[loadRoom] data', data);
        setMinPlayer(data[0].minPlayer);
        setMaxPlayer(data[0].maxPlayer);
        setLimitedTime(data[0].limitedTime);
        setManager(data[0].manager);
      });
      
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
      console.log('[socket-user left]', data.nickname);
        setchats(chats.concat(`${data.nickname} left`));
      });

      socket.on('disconnect', () => {
        console.log('[socket-disconnect]');
        setIsConnected(false);
  });
    //  socket.on('new message', (data) => {
    //    setchats(chats.concat(`${data.username} : ${data.message}`));
    //  });
     return () => {
          socket.off('login');
          socket.off('disconnect');
    //    socket.off('new message');
          socket.off('join');
     };
   });


  const ONCHANGE = (e) =>{
  //  setNickName(e.target.value);
  }

  const GAMESTART = () =>{
    console.log('[WatingRoom] GAMESTART - room', room);
    console.log('[WatingRoom] GAMESTART - users', users);
    let usersExcecptM  = users.filter((element) => element !== manager);
    console.log('[WatingRoom] GAMESTART - usersExcecptM', usersExcecptM);
    socket.emit('game start', {room : room, playerNum: playerNum-1, users: usersExcecptM});

  }

  return (
    <div>
      <h1>WaitingRoom</h1>
      <ul>
        <li>
          <div>
            <h3>WaitingRoom</h3>
              <h2>내 정보</h2>
              <p>Nickname: { '' + nickname }</p>
              <p>Connected: { '' + isConnected }</p>
              <p>socket ID: {`(${socket.id})` }</p> 



              <h2>방 정보 </h2>
              <p>roomPin: { '' + room }</p>
              <p>limitedTime: { '' + limitedTime }</p>
              <p>현재인원 / 최소인원 / 최대인원: { '' + playerNum +' / ' + minPlayer + ' / ' + maxPlayer }</p>
              <p>플레이어 목록: {''+ users }</p>


              <div className="scrollBlind">
                <ul class ="message">
                  {chats.map((val, index) => {
                    return (<li key={index}>{val}</li>);
                  })}
                </ul>
              </div>
              { manager == nickname && <button onClick={GAMESTART}>게임 시작</button>}
           
          </div>
        </li>
      </ul>
    </div>
  );

};

export default WaitingRoom;