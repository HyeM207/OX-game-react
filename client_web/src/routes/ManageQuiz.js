import React, {useState, useEffect} from 'react';
import {Menu, socket} from '../components';
import {useNavigate, useLocation } from 'react-router-dom';

const ManageQuiz = () => {

    // const location = useLocation();
    // const nickname = location.state.nickname;
    // console.log('nicknameMANAGEQUIZ: ', nickname);
    const nickname ='WOO';
    const [quizData, setQuizData] = useState([]);
    const [idx, setIdx] = useState(0);
    const [list, setList] = useState([]);
    const [mounted, setMounted] = useState(false)

    var test = [];

    socket.emit("nickname", nickname); // ### socket으로 서버에 nickname 송신 ### (이걸로 퀴즈 select 함)

    // #### socket으로 수신 #### (특정 닉네임 가진 퀴즈들 받아옴)
    // useEffect(()=>{
    //     socket.on("s_quizzes", (data)=>{
    //         test=data;
    //         console.log(data);

    //     })        
    // })

    socket.on("s_quizzes", (data)=>{
        
        console.log(data);
        test=data;
        // console.log(test);
        // const inputData = data.map((raw)=>({
        //     title: raw.title,
        //     num: raw.problem_num
        // }))
        setQuizData(test);
        //test=data;
        //this.setState({test})

    }) 
    console.log(test);

    // socket.on(`From::${sensor}`, data => {
    //     responses[sensor] = data
    //     this.setState({responses});
    //   });


    // new Promise((resolve) => {
    //     socket.on("s_quizzes", (data)=> {
    //         console.log("추출된 퀴즈들 수신함");
    //         console.log('######: ', data); 
    //         resolve(data);
    //     });

    // }).then((data)=>{
    //     test=data;
    //     console.log('please ', test);
    //     setQuizData(data);
    // })

    
   

    




    return (
        <div>
            <Menu />
            {test}
            <ul className='Quiz-List'>
            {list.map((value) => (
                <li className='Problem-Item'>
                    
                </li>
            ))}
            </ul>
        </div>

    );
};

export default ManageQuiz;