import React, {useState, useEffect} from 'react';
import {socket} from '../components';
import {useNavigate, useLocation } from 'react-router-dom';

const ManageQuiz = () => {
    
    const navigate = useNavigate();

    const location = useLocation();
    const nickname = location.state.nickname;
    console.log('nicknameMANAGEQUIZ: ', nickname);

    const [quizData, setQuizData] = useState([]); 

    //#### socket으로 수신 #### (특정 닉네임 가진 퀴즈들 받아옴)
    useEffect(()=>{
        var i=0;
        socket.emit("nickname", nickname); // ### socket으로 서버에 nickname 송신 ### (이걸로 퀴즈 select 함)
        socket.on("myQuizzes", (data)=>{
            for(i=0; i<data.length; i++){
                setQuizData(quizData.concat(data[i]));
                quizData.push(data[i]); 
            }          
        })        
    },[]);

    // 퀴즈 리스트 클릭 => 해당 퀴즈 EDIT PAGE로 이동
    const onClickTitle = (e) => {         
        navigate("/dynamic-web_OXGame/editquiz",{state : {quiz: quizData[e.target.id], nickname: nickname}});
    }

    // 퀴즈 삭제 버튼 클릭
    const onClickDelete = (e) => {       
        setQuizData(quizData.filter((value)=> e.target.id !== value._id)); 

        // ### SOCKET 으로 삭제할 퀴즈 ID 전송
        socket.emit('drop_ID', e.target.id);
    }

    // 퀴즈 출제 버튼 클릭 => 출제 페이지로 이동
    const onClickCreate = (e) => {
        navigate("/dynamic-web_OXGame/createquiz",{state : {nickname : nickname}});
    }


    return (
        <div>
            <h1>MY QUIZ LIST</h1>
            <table border="1" style={{margin: 'auto'}}>
                <thead>
                    <tr>
                        <td>idx</td>
                        <td>title</td>
                        <td>problem_num</td>
                        <td>date</td>
                        <td>function</td>
                    </tr>
                </thead>
                {quizData.map((value, index) => (
                    <tr id={index} >
                        <td id={index} onClick={onClickTitle}>{index+1}</td>
                        <td id={index} onClick={onClickTitle}>{value.title}</td>
                        <td id={index} onClick={onClickTitle}>{value.problem_num}</td>
                        <td id={index} onClick={onClickTitle}>{value.date}</td>
                        <td><button onClick={onClickDelete} id={value._id}>퀴즈 삭제</button></td>
                    </tr>
                        
                ))}
            </table>
            <br/>
            <button onClick={onClickCreate}>퀴즈 출제하러 가기</button>     
        </div>

    );
};

export default ManageQuiz;