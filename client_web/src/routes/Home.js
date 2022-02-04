import React, { useEffect, useState } from 'react';
import {Menu, socket} from '../components';
import {useLocation, useNavigate} from "react-router-dom";

 const Home = () => {

  console.log("Home에서 호출됨");

   const navigate = useNavigate();
   const location = useLocation();
   console.log('location: ', location); 

   const nickname = location.state.nickname;
   console.log('nickname: ', nickname); 

  
   const [isConnected, setIsConnected] = useState(socket.connected);
   const [room, setRoom] = useState('');

   // 이거 안 먹음
  //  if (location.state == ''  ) {
  //    console.log('location.state 있음 :',location.state ,':');
  //    navigate('dynam`ic-web_OXGame/login');
  //  }
  useEffect(async() => {    

      socket.on("room permission", (data) => {
        console.log('[socket- room permission]',data.permission, data.room);
        if (data.permission == true){
          console.log('[socket- room permission true]',nickname, data.room);
          navigate('/dynamic-web_OXGame/waitingRoom',{state :{nickname : nickname, room : data.room}});
        }
      });
      
   });

 

 
   const ENTERWAITING = () => {
     console.log('ENTERWAITING');
     socket.emit('isValidRoom',room);
    //  navigate('/dynamic-web_OXGame/waitingRoom',{state :{nickname : nickname, room : room}});
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