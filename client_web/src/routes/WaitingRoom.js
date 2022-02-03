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
  const [number, setNumber] = useState(0);
  const [users, setUsers] = useState([]);

   useEffect(async() => {
    // socket.emit('add user', nickname);
     
    socket.emit('add user', {nickname: nickname, room: room});


     socket.on('login', (data) => {
        console.log('[socket-login]', data.numUsers);
        setUsers(data.users);
        setIsConnected(true);    
     });

     socket.on('user joined', (data) =>{
      console.log('[socket-user joined]', data.nickname);
       setNumber(data.numUsers);
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

  const ENTERGAME = () =>{
    console.log('[WatingRoom] nickname:', nickname);
    navigate('/dynamic-web_OXGame/quizRoom',{state: {nickname : nickname}});
  }

  return (
    <div>
      <h1>WatingRoom</h1>
      <ul>
        <li>
          <div>
            <h3>WatingRoom</h3>
              <h2>내 정보</h2>
              <p>Nickname: { '' + nickname }</p>
              <p>Connected: { '' + isConnected }</p>
              <p>socket ID: {`(${socket.id})` }</p> 



              <h2>방 정보 </h2>
              <p>room: { '' + room }</p>
              <p>현재인원/ 최소인원: { '' + number +'/' +'미정' }</p>
              <p>플레이어 목록: {''+ users }</p>


              <div className="scrollBlind">
                <ul class ="message">
                  {chats.map((val, index) => {
                    return (<li key={index}>{val}</li>);
                  })}
                </ul>
              </div>
            <button onClick={ENTERGAME}>게임 시작</button>
          </div>
        </li>
      </ul>
    </div>
  );

};

export default WaitingRoom;