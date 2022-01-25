import React, { useEffect, useState } from 'react';
import {Menu, socket} from '../components';
import {useLocation} from "react-router-dom"
 
 const Home = () => {

  console.log("Home에서 호출됨");


   const location = useLocation();
   console.log('location: ', location); 
       
   const nickname = location.nickname;
   const [chats, setchats] = useState([]);
   const [isConnected, setIsConnected] = useState(socket.connected);
   const [Msg, setMessage] = useState(null);
 
   const addChatMessage = (data) => {
      let message = '';
      if (data.numUsers === 1) {
        message += `there's 1 participant`;
      } else {
        message += `there are ${data.numUsers} participants`;
      }
      setchats(chats.concat(message));
   }
 
   useEffect(async() => {
       
     socket.emit('add user', nickname);
     
     socket.on('login', (data) => {
       setIsConnected(true);    
       addChatMessage(data);
     });
     socket.on('user joined', (data) =>{
       setchats(chats.concat(`${data.username} joined`));
     })
     socket.on('user left', (data) => {
       setchats(chats.concat(`${data.username} left`));
     });
     socket.on('disconnect', () => {
       setIsConnected(false);
     });
     socket.on('new message', (data) => {
       setchats(chats.concat(`${data.username} : ${data.message}`));
     });
     return () => {
       socket.off('login');
       socket.off('disconnect');
       socket.off('new message');
     };
   });
 
   const sendMessage = () => {
     console.log(Msg);
     setchats(chats.concat(`${nickname} : ${Msg}`));
     socket.emit('new message', Msg);
     setMessage('');
   }
 
   const onChange = (e) =>{
     setMessage(e.target.value);
   }
 
   return (

     <div className="App">
       <header className="App-header">
         <p>Connected: { '' + isConnected }</p>
         <p>socket ID: {nickname+`(${socket.id})` }</p>
         <div className="scrollBlind">
           <ul class ="message">
             {chats.map((val, index) => {
               return (<li key={index}>{val}</li>);
             })}
           </ul>
         </div>
         <div>
           <input 
             onChange={onChange} value={Msg} class="inputMessage" 
             placeholder="Type here..." 
             onKeyPress={(e)=>{
               if (e.key === 'Enter')
                 sendMessage();
             }}/>
           <button onClick={sendMessage} >Send</button>
         </div>
       </header>
     </div>
   );
 };
 
 export default Home;