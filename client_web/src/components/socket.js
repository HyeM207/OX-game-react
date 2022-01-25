import React from 'react';
import io from "socket.io-client";
// import { SOCKET_URL } from "config";

// export const socket = io('localhost:5000');



const namespace = "dynamic-web_OXGame"; //일단 서버 공용 형식을 위해 웹인지 게임이름이 어떤 건지를 구분할 수 있도록 정보를 나타내었고 다이나믹 namespace를 사용하기 때문에 앞에 dynamic표시를 해줌
// 이름은 확정은 아니지만 당분간은 이 이름으로 진행하는 것임 (서비스 이름 미정)
export const socket = io.connect(`http://192.168.200.156:7000/${namespace}`, {
  query: `ns=${namespace}`, // 지금은 필요없는 기능이지만 그 전 구조에서는 이 값으로 게임 모듈을 연결해주는 역할이었음 
  // 추후 필요하면 쓰일 수 있는 기능이라 없애지는 않음
});



export const SocketContext = React.createContext();


// socket.emit("test", "hello"); // 서버로 데이터 전송시 (문자열 대신 json형식 가능)
// socket.on("server", (data) => { // 서버로부터 데이터 받는 부분  서버에서는 socket.emit("server", data)형식으로 존재
//   console.log(data);
// })
