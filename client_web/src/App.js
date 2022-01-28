// src/App.js 는 메인 페이지에 들어갈 HTML을 짜는 곳
// 실제 태그 내용 구현 하는 장소 

//react.js 는 나도 이제 서버와 클라이언트 코드를 구분하기 위해 처음 구글링하며 socket.io통신만 구현해놓음
//클라이언트는 서버보다는 처음 통신 시작 형식 제외하고는 좀 더 자유롭게 개발 가능
//다만 통신 시작 시 해당 namespace이름만 지켜주면 됨

// import logo from './logo.svg';
// import './App.css';
import React from 'react';

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {Home, Main, Login, Insert, WaitingRoom} from './routes';
import io from "socket.io-client";
import './App.css';
import ReactDOM from 'react-dom'; 


// const namespace = "dynamic-web_OXGame"; //일단 서버 공용 형식을 위해 웹인지 게임이름이 어떤 건지를 구분할 수 있도록 정보를 나타내었고 다이나믹 namespace를 사용하기 때문에 앞에 dynamic표시를 해줌
// // 이름은 확정은 아니지만 당분간은 이 이름으로 진행하는 것임 (서비스 이름 미정)
// const socket = io.connect(`http://172.30.1.60:7000/${namespace}`, {
//   query: `ns=${namespace}`, // 지금은 필요없는 기능이지만 그 전 구조에서는 이 값으로 게임 모듈을 연결해주는 역할이었음 
//   // 추후 필요하면 쓰일 수 있는 기능이라 없애지는 않음
// });
// socket.emit("test", "hello"); // 서버로 데이터 전송시 (문자열 대신 json형식 가능)
// socket.on("server", (data) => { // 서버로부터 데이터 받는 부분  서버에서는 socket.emit("server", data)형식으로 존재
//   console.log(data);
// })



function App() {
  console.log("app 호출됨");
   return (
    <div className="App">
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/main" element={<Main/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/insert" element={<Insert/>}/>
            <Route path="/waitingRoom" element={<WaitingRoom/>}/>
          </Routes>
    </div>
  );
}

export default App;
