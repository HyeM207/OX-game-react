import React, { useEffect, useState } from 'react';
import {Menu, socket} from '../components';
import {useNavigate, useLocation} from 'react-router-dom';


const CreateRoom = () => {

    const navigate = useNavigate();

    // location-state에 저장된 닉네임 불러오기 
    const location = useLocation();
    console.log('[CreateRoom] location: ', location); 
    
    const nickname = location.state.nickname;
    console.log('[CreateRoom] nickname: ', nickname);


    const [minPlayer, setMinPlayer] = useState(2);
    const [maxPlayer, setMaxPlayer] = useState(5);
    const [limitedTime, setLimitedTime] = useState(10);
    const [quizID,setQuizID ] = useState('')
    const [quizTitle,setQuizTitle ] = useState('')
    const [quizzes, setQuizzes] = useState([]);

    useEffect(async() => {

        socket.on('showQuiz', (data) => {
            var quizStr =[];
            data.map((quiz) => {
                quizStr = quizStr.concat(quiz);
            });

            console.log('[socket-showQuiz] quizStr :' ,quizStr);
            setQuizzes(quizStr);
        });


        socket.on('succesCreateRoom', (data) => {
            console.log('[socket-succesCreateRoom] roomPin :' , data.roomPin);
            navigate('/dynamic-web_OXGame/waitingRoom',{state: {nickname : nickname, room: data.roomPin}});
        });
        
    });


    // 퀴즈 불러오기 버튼 누를 시 해당 닉네임으로 퀴즈 목록을 불러옴
    const LOADQUIZ = () => {
        console.log('[CreateRoom] LOADQUIZ | nickname', nickname);
        socket.emit('loadQuiz', {nickname: nickname});
    }

    const ONCHANGE_MINP = (e) =>{
        setMinPlayer(e.target.value);
      }

    const ONCHANGE_MAXP = (e) =>{
        setMaxPlayer(e.target.value);
    }

    const ONCHANGE_LIMT = (e) =>{
        setLimitedTime(e.target.value);
    }

    const NEWQUIZ = () =>{
        console.log('[CreateRoom] NEWQUIZ(새 퀴즈 생성)- nickname', nickname);
        navigate('/dynamic-web_OXGame/insert',{state :{nickname : nickname}});
    }

    const SECLCTQUIZ = (e) =>{
        console.log('[CreateRoom] SECLCTQUIZ(퀴즈 선택!)- index', e.target.id);
        var quizIdx = e.target.id;
        setQuizID(quizzes[quizIdx]._id);
        setQuizTitle(quizzes[quizIdx].title);
    }

    // 방 생성하기 버튼 누를 시 게임 룸 생성 
    const CREATEROOM = () =>{
        console.log('[CreateRoom] ONCLICK- nickname', nickname);
        console.log('[CreateRoom] ONCLICK-settings', minPlayer, maxPlayer, limitedTime, quizID);

        var room = {
            manager : nickname,
            // creationDate : ,
            // endDate: (waiting 룸에서 설정)
            isActive : true,
            // players_num: (waiting 룸에서 설정)
            maxPlayer : maxPlayer,
            minPlayer : minPlayer,
            limitedTime : limitedTime,
            //players : (waiting 룸에서 설정)
            quizID : quizID
            // roomPin: (서버단에서)
        }
        socket.emit('createRoom', room);

    }

    

    return (
        <div>
            <header>
            <h1>방 생성하기</h1>
            {/* <p>Nickname: { '' + nickname }</p>
            <p>Connected: { '' + isConnected }</p>
            <p>socket ID: {`(${socket.id})` }</p> */}
        
        
                <p>퀴즈 목록 : 
                <ul class ="message">
                  {quizzes.map((val, index) => {
                    return (<li key={index} onClick={SECLCTQUIZ} id={index}>Title:{val.title} 문제 수 : {val.problem_num}</li>);
                  })}
                </ul>
                <button onClick={LOADQUIZ}>퀴즈 목록 불러오기</button> 
                <button onClick={NEWQUIZ}>새 퀴즈 만들기</button></p>
                <p>선택한 퀴즈: {quizTitle} </p>
                <p>최소 인원 : <input type="text" onChange={ONCHANGE_MINP} value={minPlayer} /> 명</p>
                <p>최대 인원 : <input type="text" onChange={ONCHANGE_MAXP} value={maxPlayer} /> 명 </p>
                <p>라운드 별 문제 풀이 시간 : <input type="text" onChange={ONCHANGE_LIMT}  value={limitedTime} /> 초</p>
                <button onClick={CREATEROOM}>방 생성하기</button>
            
            </header>
      </div>
    );

};

export default CreateRoom;