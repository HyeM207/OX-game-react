import React, {useState} from 'react';
import {Menu} from '../components';
import {useNavigate} from 'react-router-dom';
import io from "socket.io-client";

const namespace = "dynamic-web_OXGame"; //일단 서버 공용 형식을 위해 웹인지 게임이름이 어떤 건지를 구분할 수 있도록 정보를 나타내었고 다이나믹 namespace를 사용하기 때문에 앞에 dynamic표시를 해줌
// 이름은 확정은 아니지만 당분간은 이 이름으로 진행하는 것임 (서비스 이름 미정)
const socket = io.connect(`http://192.168.56.1:7000/${namespace}`, {
  query: `ns=${namespace}`, // 지금은 필요없는 기능이지만 그 전 구조에서는 이 값으로 게임 모듈을 연결해주는 역할이었음 
  // 추후 필요하면 쓰일 수 있는 기능이라 없애지는 않음
});



const Insert = ({location, history }) => {
  console.log('Insert에서 호출됨');

  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const onChangeTitle = (e) => { setTitle(e.target.value); }

  const [list, setList] = useState([]);
  const [round, setRound] = useState(1);
  const [problems, setProblems] = useState([]);
  const [inputs, setInputs] = useState({ question: '', answer: '' });
  const { question, answer } = inputs;
  
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
    setRound(round+1);

    const problem = {
      question,
      answer,
      round
    };
    setProblems(problems.concat(problem));

    setInputs({
      question: '',
      answer: ''
    });
  };

  // 문제 리스트 클릭시 수정
  const onClickList = (event) =>{
    if(event.target.id && event.target.id.split('-').length > 1){
      const buttonFunction = event.target.id.split('-')[1]
    
      if(buttonFunction === "Update"){
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
            var selected_problem = problems[value.round-1];
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
        console.log("id: ",e.target.id);
          if (e.target.id === "Problem-Updating-" + String(value.round)) {
            var selected_problem = problems[value.round-1];
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

  const onClickModify = (e) =>{
    console.log("수정 버튼 클릭");
    setList(
      list.map((value) => {
        if(e.target.id === "Problem-Updating-"+String(value.round)) {
          console.log("LAST Modify Problem: ", problems[value.round-1])
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
  const onSubmit = () =>{
    console.log('onSubmit 호출됨');
    console.log('problems', problems);
    console.log('num:', problems.length);

    var quiz = {
      manager: 'WOO',
      problem_num: problems.length,
      problems: problems,
      title: title
  }
  console.log('quiz:', quiz);
  socket.emit("quiz", quiz);
  console.log("SOCKET 전송완료");

  }


 
  return (
    <div>
      <Menu />
      <h1>문제 입력</h1>
      <h3>퀴즈 제목 <input type="text" value={title} onChange={onChangeTitle}/> </h3>
      {/* ========================================================================================== */}

      <ul className='Problems-List' onClick={onClickList}>
        {list.map((value) => (
          <li className='Problem-Item'>
            {value.isUpdating
            ? <p>
                <input id={"Problem-Updating-"+String(value.round)} defaultValue={value.question} onChange={onChangeQuestion}/>
                <input type="radio" id={"Problem-Updating-"+String(value.round)} value="option1"  name="answer" onClick={onChangeOption} /> Option 1
                <input type="radio" id={"Problem-Updating-"+String(value.round)} value="option2" name="answer" onClick={onChangeOption} /> Option 2
                <button id={"Problem-Updating-"+String(value.round)} onClick={onClickModify}>수정 완료</button>
              </p>
            : <p id={"Problem-Update-"+String(value.round)}> 
                Q{value.round}.{value.question} A.{value.answer}
              </p>
            }
          </li>
        ))}
      </ul>

      {/* ========================================================================================== */}
      <h5>
        질문 <textarea name="question" value={question} onChange={onChange}  />
        <input type="radio" value="option1"  name="answer" onChange={onChange} /> Option 1
        <input type="radio" value="option2" name="answer" onChange={onChange} /> Option 2
        <button onClick={onCreate}>문제 추가</button>
      </h5>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <button onClick={onSubmit}>문제 출제 완료</button>
    </div>

    
  );
  
};
  
export default Insert;