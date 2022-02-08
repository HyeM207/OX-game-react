import React, { useEffect, useState } from 'react';
import {Menu, socket} from '../components';
import {useLocation, useNavigate} from "react-router-dom";
import '../css/bootstrap.min.css'
 const Home = () => {


   const navigate = useNavigate();
   const location = useLocation();
  //  console.log('location: ', location); 

   const nickname = location.state.nickname;
  //  console.log('nickname: ', nickname); 

  
   const [isConnected, setIsConnected] = useState(socket.connected);
   const [room, setRoom] = useState('');
   const [message, setMessage] = useState('');

   // 이거 안 먹음
  //  if (location.state == ''  ) {
  //    console.log('location.state 있음 :',location.state ,':');
  //    navigate('dynam`ic-web_OXGame/login');
  //  }

  useEffect(async() => {    

      socket.on("room permission", (data) => {
        console.log('[socket- room permission]',data.permission, data.room);
        // openModal();
       
        if (data.permission == true){
          console.log('[socket- room permission true]',nickname, data.room);
          setMessage("");
          navigate('/dynamic-web_OXGame/waitingRoom',{state :{nickname : nickname, room : data.room}});
        }
        else{
          setMessage("Wrong RoomPin!");
        }
      });
      
    },[]);
 

 
   const ENTERWAITING = () => {
    //  console.log('ENTERWAITING');
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
     
     <div style={{width: "100%"}}>
     
      <Menu />
      <div class="card bg-secondary mb-3" style={{ margin : "5px" , "max-width" : "20rem"}}>
        <div class="card-header">My Info</div>
        <div class="card-body">
          <h4 class="card-title">{nickname}</h4>
          <p class="card-text"> Connected: { '' + isConnected } </p>
          <p class="card-text"> socket ID: {`(${socket.id})` }</p>
        </div>
      </div>
   
  

      <div style={{ position: "absolute", top: "55%", left: "50%", transform: "translate(-50%,-50%)"}}>
        <div class="d-grid gap-2">
          <h4>{message}</h4>
          <input onChange={ONCHANGEROOM} value={room} type="text"  placeholder="RoomPin (5 Number)"/>
          <button class="btn btn-lg btn-primary" type="button" onClick={ENTERWAITING}>Enter QuizRoom</button>
          <button class="btn btn-secondary" type="button" onClick={InsertPage}>Create Quiz</button>
          <button class="btn btn-success" type="button" onClick={ManageQuiz}>Manage Quiz</button>
          <button class="btn btn-warning" type="button" onClick={CreateRoom}>Make QuizRoom</button>
        </div>
      </div>




      {/* <div class="accordion" id="accordionExample">
      <div class="accordion-item">
      <h2 class="accordion-header" id="headingOne">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
          Accordion Item #1
        </button>
      </h2>
      <div id="collapseOne" class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
        <div class="accordion-body">
          <input onChange={ONCHANGEROOM} value={room} type="text"/>
        </div>
      </div>
    </div>
    </div> */}
 
         {/* <div>
           <p>  <input onChange={ONCHANGEROOM} value={room} type="text"/>
             <button onClick={ENTERWAITING} > 방 입장</button></p>
           <p><button onClick={InsertPage}>퀴즈 생성</button></p>
           <p><button onClick={ManageQuiz}>퀴즈 관리</button></p>
           <p><button onClick={CreateRoom}>방 생성</button></p>
         </div> */}
    
     </div>
   );
 };
 
 export default Home;