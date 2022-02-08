import React, { useState } from 'react';
import { socket } from '../components';
import { useNavigate, useLocation } from 'react-router-dom';
import "../css/bootstrap.css";

const Insert = () => {

  const navigate = useNavigate();
  
  const location = useLocation();
  const nickname = location.state.nickname;
  console.log('nicknameINSERT: ', nickname);
  
  const [title, setTitle] = useState('');
  const [list, setList] = useState([]);
  const [round, setRound] = useState(1);
  const [problems, setProblems] = useState([]);
  const [inputs, setInputs] = useState({ question: '', answer: '' });
  const { question, answer } = inputs;

  const now = new Date();
  const date = now.getFullYear() + '.' + (now.getMonth() + 1) + '.' + now.getDate();

  // 제목 입력
  const onChangeTitle = (e) => { setTitle(e.target.value); }

  // 새 질문/답변 입력
  const onChange = e => {
    const { name, value } = e.target; // e.target 에서 name 과 value 를 추출
    setInputs({
      ...inputs, // 기존의 input 객체를 복사한 뒤
      [name]: value // name 키를 가진 값을 value 로 설정
    });
  }

  // 문제 추가 버튼 클릭 => List에 추가
  const onCreate = () => {
    setList((prev) => [
      ...prev,
      {
        round: round,
        question: question,
        answer: answer,
        isUpdating: false
      }
    ]);
    setRound(round + 1);

    const problem = {
      question,
      answer,
      round
    };
    setProblems(problems.concat(problem));

    setInputs({ question: '', answer: '' });
  };

  // 문제 리스트 클릭시 수정
  const onClickList = (event) => {
    if (event.target.id && event.target.id.split('-').length > 1) {
      const buttonFunction = event.target.id.split('-')[1]

      if (buttonFunction === "Update") {
        console.log("UPDATE SELECTED");
        setList(
          list.map((value) => {
            if (event.target.id === "Problem-Update-" + String(value.round)) {
              return { ...value, isUpdating: !value.isUpdating };
            }
            return value;
          })
        );
      }
    }
  };

  // 질문 수정
  const onChangeQuestion = (e) => {
    setList(
      list.map((value) => {
        if (e.target.id === "Problem-Updating-" + String(value.round)) {
          var selected_problem = problems[value.round - 1];
          selected_problem.question = e.target.value;
          return {
            ...value,
            question: e.target.value,
          };
        }
        return value;
      })
    );
  }

  // 답변 수정
  const onChangeOption = (e) => {
    setList(
      list.map((value) => {
        console.log("id: ", e.target.id);
        if (e.target.id === "Problem-Updating-" + String(value.round)) {
          var selected_problem = problems[value.round - 1];
          selected_problem.answer = e.target.value;
          return {
            ...value,
            answer: e.target.value,
          };
        }
        return value;
      })
    );
  }

  const onClickModify = (e) => {
    console.log("수정 버튼 클릭");
    setList(
      list.map((value) => {
        if (e.target.id === "Problem-Updating-" + String(value.round)) {
          console.log("LAST Modify Problem: ", problems[value.round - 1])
          return {
            ...value,
            isUpdating: false
          };
        }
        return value;
      })
    )
  }



  // 모든 문제 출제 완료
  const onSubmit = () => {
    console.log('onSubmit 호출됨');

    var quiz = {
      manager: nickname,
      problem_num: problems.length,
      problems: problems,
      title: title,
      date: date
    }
    console.log('quiz:', quiz);
    socket.emit("quiz", quiz); // ### socket으로 서버에 폼에 입력한 데이터 송신 ###

    // 퀴즈 목록 페이지로 이동
    navigate("/dynamic-web_OXGame/managequiz", { state: { nickname: nickname } });

  }



  return (
    <div>
      <h1>문제 입력</h1>
      <h3>퀴즈 제목 <input type="text" value={title} onChange={onChangeTitle} /> </h3>
      {/* ========================================================================================== */}

      <ul className='Problems-List' onClick={onClickList}>
        {list.map((value) => (
          <li className='Problem-Item'>
            {value.isUpdating
              ? <p>
                <input id={"Problem-Updating-" + String(value.round)} defaultValue={value.question} onChange={onChangeQuestion} />
                <input type="radio" id={"Problem-Updating-" + String(value.round)} value="true" name="answer" onClick={onChangeOption} /> true
                <input type="radio" id={"Problem-Updating-" + String(value.round)} value="false" name="answer" onClick={onChangeOption} /> false
                <button id={"Problem-Updating-" + String(value.round)} onClick={onClickModify}>수정 완료</button>
              </p>
              : <p id={"Problem-Update-" + String(value.round)}>
                Q{value.round}.{value.question} A.{value.answer}
              </p>
            }
          </li>
        ))}
      </ul>

      {/* ========================================================================================== */}
      <h5>
        질문 <textarea name="question" value={question} onChange={onChange} />
        <input type="radio" value="true" name="answer" onChange={onChange} /> true
        <input type="radio" value="false" name="answer" onChange={onChange} /> false
        <button onClick={onCreate}>문제 추가</button>
      </h5>
      <br />
      <br />
      <br />
      <br />
      <br />
      <button onClick={onSubmit}>문제 출제 완료</button>
    </div>


  );

};

export default Insert;