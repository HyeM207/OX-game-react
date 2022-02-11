import React, { useEffect, useState } from 'react';
import {Menu, socket} from '../components';
import {useNavigate, useLocation } from 'react-router-dom';
import '../css/quizRoom.css'
import '../css/bootstrap.css'

const QuizRoom = () => {
  console.log("QuizResult에서 호출됨");
  const location = useLocation();
  const navigate = useNavigate();
  
  const room = location.state.room;
  const nickname = location.state.nickname;
  const manager = location.state.manager;
  const quizList = location.state.quizList;
  const choices = location.state.choices;
  // const count = location.state.count;
  // const playerNum = location.state.playerNum;
  const nav_loadState = location.state.loadState;
  const nav_rankList = location.state.rankList;
  console.log("loadState : ", nav_loadState);
  const [rankList, setRankList] = useState(nav_rankList);
  const [count, setCount] = useState(0);
  const [loadState, setLoadState] = useState(nav_loadState);
  const total = quizList.problems.length

  useEffect(async() => {
    socket.on("rankQuiz", (data) => { // 퀴즈 순위 리스트 {rank: int, nickname: string, count: int}
      setRankList(data);
      console.log("rank Quiz : ", data);

      const idx = data.findIndex(function(prev) {
        console.log("prev data : ", prev);
        console.log("prev nickname data : ", prev.nickname);
        console.log("location nickname : ", nickname);
        console.log("prev.nickname === nickname : ", prev.nickname === nickname)
        console.log("pre count : ", prev.count);
        return prev.nickname === nickname});
        console.log("내 순위 정보 : ", idx);
        if (idx != -1) {
          console.log("idx.count : ", data[idx].count);
          setCount(data[idx].count);
        }
    })
  }, []);

  const enterAnswer = () => {
    console.log("quiz quizList : ", quizList);
    navigate('/dynamic-web_OXGame/quizAnswer', {state: {room: room, nickname : nickname, manager : manager, quizList : quizList, choices : choices, count : count, rankList: rankList}});
  }

  const enterHome = () => {
    console.log("quiz quizList : ", quizList);
    console.log("!!! manager : ", manager, " nickname:", manager);
    socket.emit('game end', {manager : manager, nickname : nickname});
    navigate('/dynamic-web_OXGame', {state: {nickname : nickname}});
  }

  const quizResult = () => {
    console.log("quiz result choices : ", choices);
    console.log("you sovle : ", choices.length);
    console.log("you solve count : ", count);
    console.log("ranklist : ", rankList);
    // console("load state : ", loadState);

    return(
      <div>
        <Menu />


        <br/><h1>퀴즈 결과</h1><br/>
        <h3>닉네임 : {nickname}</h3>

        푼 문제 : {count} / {total}

        <br/><br/>

        <table border="1" style={{margin:'auto', width: '50vw'}} class="table">
          <thead>
            <tr>
              <td>순위</td>
              <td>닉네임</td>
              <td>정답 개수</td>
            </tr>
          </thead>

          <tbody>
            {
              rankList.map((rank, index) => (
                <tr>
                  <td>{index + 1}</td>
                  <td>{rank.nickname}</td>
                  <td>{rank.count}</td>
                </tr>
              ))
            }
          </tbody>
        </table>

        <br/>
        <div style={{margin:'auto'}} >
          <button onClick={enterAnswer} class="btn btn-primary" type="button" id="button-addon2" style={{ margin : "5px", width : "auto", font:"1em" }}>정답 보기</button>
          &nbsp;&nbsp;&nbsp;
          <button onClick={enterHome} class="btn btn-primary" type="button" id="button-addon2" style={{ margin : "5px", width : "auto", font:"1em" }}>홈으로 이동</button>
        </div>
        

        
      </div>
    );
  }

  const adminQuizResult = () => {
    console.log("quiz result choices : ", choices);
    console.log("you sovle : ", choices.length);
    console.log("you solve count : ", count);
    console.log("ranklist : ", rankList);
    // console("load state : ", loadState);

    return(
      <div>

        <Menu />


        <br/><h1>퀴즈 결과</h1><br/>
        <h3>닉네임 : {nickname}</h3>

        [ 퀴즈 관리자 ]

        <br/><br/>

        <table border="1" style={{margin:'auto', width: '50vw'}} class="table">
          <thead>
            <tr>
              <td>순위</td>
              <td>닉네임</td>
              <td>정답 개수</td>
            </tr>
          </thead>

          <tbody>
            {
              rankList.map((rank, index) => (
                <tr>
                  <td>{index + 1}</td>
                  <td>{rank.nickname}</td>
                  <td>{rank.count}</td>
                </tr>
              ))
            }
          </tbody>
        </table>

        <br/>
        <div style={{margin:'auto'}} >
          <button onClick={enterAnswer} class="btn btn-primary btn-sm" type="button" style={{ margin : "5px", width : "auto", font:"1em" }}>정답 보기</button>
          &nbsp;&nbsp;&nbsp;
          <button onClick={enterHome} class="btn btn-primary btn-sm" type="button" style={{ margin : "5px", width : "auto", font:"1em" }}>홈으로 이동</button>
        </div>
        

        
      </div>
    );
  }

  const loading = () => {
    // console.log("player num  : ", playerNum);
    console.log("rankList.length  : ", rankList.length);
    // console("load state : ", loadState);

    return(
      <div>
        <h1>퀴즈 결과</h1>
        <h3>닉네임 : {nickname}</h3>

        푼 문제 : {count} / {total}

        <br/><br/>

        로딩 중 . . .
      </div>
    );
  }

  return (
    <div>
      {
        manager == nickname
        ? adminQuizResult()
        : quizResult()
      }
    </div>
  );
};

export default QuizRoom;