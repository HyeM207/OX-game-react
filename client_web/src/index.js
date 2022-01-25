import React from 'react';
import ReactDOM from 'react-dom'; 
import { BrowserRouter } from "react-router-dom";
//import './index.css';
import App from './App';
import {Home, Main, Login} from './routes';
//import reportWebVitals from './reportWebVitals';
//import client_socket from './socket';

// src/index.js 는 Entry 파일로,  id값이 'root'인 index.html파일의 root를 지정해준다.

ReactDOM.render(
  <BrowserRouter>
    <App/>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

//reportWebVitals();