import React, {useState} from 'react';
import {Menu} from '../components';
import {useNavigate} from 'react-router-dom';



const Login = ({location, history }) => {

  const navigate = useNavigate();
  const [nickname, setNickName] = useState('');

  console.log('Login에서 호출됨');

  const ONCHANGE = (e) =>{
    setNickName(e.target.value);
  }

  const ONCLICK = () =>{

  
    console.log('nickname:', nickname);
    // history.push({
    //   pathname : '/',
    //   state: {nickname : nickname},
    // });
    navigate('/',{nickname : nickname});
    // navigate('/');
  }

  return (
    <div>
      <Menu />
      <h1>로그인</h1>
      <ul>
        <li>
          <div>
            <h3>What's your nickname?</h3>
            <input onChange={ONCHANGE} value={nickname} type="text"
              onKeyPress={(e)=>{
                if (e.key === 'Enter')
                ONCLICK();
              }}/>
            <button onClick={ONCLICK}>입장</button>
          </div>
        </li>
      </ul>
    </div>
  );

};

export default Login;