import React, {useState} from 'react';
import {socket} from '../components';
import {useNavigate, useLocation } from 'react-router-dom';

const EditQuiz = () => {
    
    const navigate = useNavigate();

    const location = useLocation();
    const nickname = location.state.nickname;
    console.log('nicknameEDITQUIZ: ', nickname);

    const now = new Date();
    const date = now.getFullYear() + '.' + (now.getMonth()+1) + '.' + now.getDate();

    const [quiz, setQuiz] = useState(location.state.quiz);
    const quizID = useState(quiz._id);
    const [title, setTitle] = useState(quiz.title);
    const [problems, setProblems] = useState(quiz.problems);
    const [inputs, setInputs] = useState({ newQuestion: '', newAnswer: '' });
    const { newQuestion, newAnswer } = inputs;

    // 퀴즈 제목 수정
    const onChangeTitle = (e) => { setTitle(e.target.value); }

    // 질문 수정
    const onChangeQuestion = (e) => {
        setProblems(
            problems.map((value, index) => {
                if (e.target.id === "question-" + String(index+1)) {
                    var selected_problem = problems[index];
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
        setProblems(
            problems.map((value, index) => {
                if (e.target.id === "answer-" + String(index+1)) {
                    var selected_problem = problems[index];
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

    // 문제 삭제
    const onClickDelete = (e) =>{
        setProblems(problems.filter((value, index)=> e.target.id !== "problem-" + String(index+1))); 
    }


    // 새 문제/답변 입력
    const onChange = e => {
        const { name, value } = e.target; // e.target 에서 name 과 value 를 추출
        setInputs({
          ...inputs, // 기존의 input 객체를 복사한 뒤
          [name]: value // name 키를 가진 값을 value 로 설정
        });
    }

    // 문제 추가 버튼 클릭
    const onCreate = () => {
        var num = problems.length+1;
        setProblems((prev) => [
            ...prev,
            {
                question: newQuestion,
                answer: newAnswer,
                round: num
            }
        ]);
        setInputs({ newQuestion: '', newAnswer: '' });     
    };

    // 퀴즈 수정 완료 버튼 클릭
    const onSubmit = () =>{
        problems.map((value, index) => {
            value.round = index+1;
        });

        var newQuiz = {
            manager: quiz.manager,
            problem_num: problems.length,
            problems: problems,
            title: title,
            date: date
        }
        console.log('newQuiz:', newQuiz);

        // 기존 quiz 삭제
        socket.emit("drop_ID", quizID[0]); // ### socket으로 id 송신 ###

        // 새로운 quiz 추가
        socket.emit("quiz", newQuiz); // ### socket으로 서버에 폼에 입력한 데이터 송신 ###

        // 퀴즈 목록 페이지로 이동
        navigate("/dynamic-web_OXGame/managequiz", {state : {nickname : nickname}});
    }

    return (
        <div>
            <h1>EDIT QUIZ PAGE</h1>
            <h3>TITLE: <input type="text" value={title} onChange={onChangeTitle}/></h3>
            {/*===============================================================*/}
            <table style={{margin: 'auto'}}>
                <thead>
                    <tr>
                        <td>idx</td>
                        <td>Question</td>
                        <td>Answer</td>
                        <td>Function</td>
                    </tr>
                </thead>

                {problems.map((value, index) => (
                    <tr>
                        <td>Q{index+1}.</td>
                        <td><input name="question" id={"question-"+String(index+1)} value={value.question} onChange={onChangeQuestion}/></td>
                        <td>
                            <input type="radio" id={"answer-"+String(index+1)} checked={value.answer==="true"} value="true"  name={"answer-"+String(index+1)} onClick={onChangeOption} /> true
                            <input type="radio" id={"answer-"+String(index+1)} checked={value.answer==="false"} value="false" name={"answer-"+String(index+1)} onClick={onChangeOption} /> false
                        </td>
                        <td><button onClick={onClickDelete} id={"problem-"+String(index+1)}>문제 삭제</button></td>
                    </tr>
                        
                ))}
            </table>
            {/*===============================================================*/}
            <h5>
                질문 <input name="newQuestion" value={newQuestion} onChange={onChange}  />
                <input type="radio" value="true"  name="newAnswer" checked={newAnswer==='true'} onChange={onChange} /> true
                <input type="radio" value="false" name="newAnswer" checked={newAnswer==='false'} onChange={onChange} /> false
                <button onClick={onCreate}>문제 추가</button>
            </h5>

            {/*===============================================================*/}
            <br/>
            <br/>
            <button onClick={onSubmit}>퀴즈 수정 완료</button>            
            
        </div>

    );
};

export default EditQuiz;