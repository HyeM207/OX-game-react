import React, {useState, useEffect} from 'react';
import {socket} from '../components';
import {useNavigate, useLocation} from 'react-router-dom';

const ManageQuiz = () => {

    //let history = useHistory();
    
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
    },[location.key]);

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
        // history.push({
        //     pathname: "/dynamic-web_OXGame/createquiz",
        //     state : {nickname : nickname}
        // })
    }

    // HOME 버튼 클릭 => HOME으로 이동
    const onClickHome = () => {
        navigate('/dynamic-web_OXGame',{state : {nickname : nickname}});
    }


    return (
        <div>
            <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
                <div class="container-fluid">
                    <a class="navbar-brand" onClick={onClickHome}>HOME</a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                    </button>
                </div>
            </nav>

            <br/><h1>MY QUIZ LIST</h1><br/>
            <table class="table table-hover" style={{margin: 'auto', width: '80%'}}>
                <thead>
                    <tr class="table-primary bg-primary">
                        <td><label style={{padding: '0.5rem'}}>idx</label></td>
                        <td><label style={{padding: '0.5rem'}}>title</label></td>
                        <td><label style={{padding: '0.5rem'}}>problem_num</label></td>
                        <td><label style={{padding: '0.5rem'}}>date</label></td>
                        <td><label style={{padding: '0.5rem'}}>function</label></td>
                    </tr>
                </thead>

                <tbody>
                    {quizData.map((value, index) => (
                        <tr id={index} >
                            <td id={index} onClick={onClickTitle}><label style={{padding: '0.5rem'}}>{index+1}</label></td>
                            <td id={index} onClick={onClickTitle}><label style={{padding: '0.5rem'}}>{value.title}</label></td>
                            <td id={index} onClick={onClickTitle}><label style={{padding: '0.5rem'}}>{value.problem_num}</label></td>
                            <td id={index} onClick={onClickTitle}><label style={{padding: '0.5rem'}}>{value.date}</label></td>
                            <td><button class="btn btn-secondary btn-sm" style={{margin: '0.5rem'}} onClick={onClickDelete} id={value._id}>퀴즈 삭제</button></td>
                        </tr>
                            
                    ))}
                </tbody>
                
            </table>
            <br />
            {quizData.length<1 ? <p class="text-primary">생성된 퀴즈가 없습니다.</p> : null}
            <br/>
            <button class="btn btn-outline-primary" onClick={onClickCreate}>새 퀴즈 생성</button> 
            <br/>
            {/* <button class="btn btn-primary" onClick={onClickHome}>HOME</button>     */}
        </div>

    );
};

export default ManageQuiz;