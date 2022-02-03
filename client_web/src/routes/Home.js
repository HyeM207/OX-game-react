import React, { useEffect, useState } from 'react';
import {Menu, socket} from '../components';
import {useLocation, useNavigate} from "react-router-dom";

 const Home = () => {

  console.log("Home에서 호출됨");

   const navigate = useNavigate();
   const location = useLocation();
   console.log('location: ', location); 
       
   // 이거 안 먹음
  //  if (location.state == ''  ) {
  //    console.log('location.state 있음 :',location.state ,':');
  //    navigate('dynam`ic-web_OXGame/login');
  //  }

   const nickname = location.state.nickname;
   console.log('nickname: ', nickname); 

  

   const [chats, setchats] = useState([]);
   const [isConnected, setIsConnected] = useState(socket.connected);
  //  const [Msg, setMessage] = useState(null);
   const [room, setRoom] = useState('');

  //  const addChatMessage = (data) => {
  //     let message = '';
  //     if (data.numUsers === 1) {
  //       message += `there's 1 participant`;
  //     } else {
  //       message += `there are ${data.numUsers} participants`;
  //     }
  //     setchats(chats.concat(message));
  //  }
 
  //  useEffect(async() => {
       
  //    socket.emit('add user', nickname);
     
  //    socket.on('login', (data) => {
  //      setIsConnected(true);    
  //      addChatMessage(data);
  //    });
  //    socket.on('user joined', (data) =>{
  //      setchats(chats.concat(`${data.username} joined`));
  //    })
  //    socket.on('user left', (data) => {
  //      setchats(chats.concat(`${data.username} left`));
  //    });
  //    socket.on('disconnect', () => {
  //      setIsConnected(false);
  //    });
  //    socket.on('new message', (data) => {
  //      setchats(chats.concat(`${data.username} : ${data.message}`));
  //    });
  //    return () => {
  //      socket.off('login');
  //      socket.off('disconnect');
  //      socket.off('new message');
  //    };
  //  });
 
   const ENTERWAITING = () => {
     console.log('ENTERWAITING');
     navigate('/dynamic-web_OXGame/waitingRoom',{state :{nickname : nickname, room : room}});
   }
 
   const ONCHANGEROOM = (e) =>{
      setRoom(e.target.value);
   }

   const InsertPage = () => {
     console.log('문제 출제 페이지로 이동합니다.');
     navigate('/dynamic-web_OXGame/createquiz',{state :{nickname : nickname}});
   }

   const CreateRoom = () => {
    console.log('방 생성 페이지로 이동합니다.');
    navigate('/dynamic-web_OXGame/createRoom',{state :{nickname : nickname}});
  }

  const ManageQuiz = () => {
    console.log('퀴즈 관리 페이지로 이동합니다.');
    navigate('/dynamic-web_OXGame/managequiz',{state :{nickname : nickname}});
  }

 
   return (
     <div>
       <header>
         <h1>HOME</h1>
         <p>Nickname: { '' + nickname }</p>
         <p>Connected: { '' + isConnected }</p>
         <p>socket ID: {`(${socket.id})` }</p>
    
         <div>
           <p>  <input onChange={ONCHANGEROOM} value={room} type="text"/>
             <button onClick={ENTERWAITING} > 방 입장</button></p>
           <p><button onClick={InsertPage}>퀴즈 생성</button></p>
           <p><button onClick={ManageQuiz}>퀴즈 관리</button></p>
           <p><button onClick={CreateRoom}>방 생성</button></p>
         </div>
       </header>
     </div>
   );
 };
 
 export default Home;