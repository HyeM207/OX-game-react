import React, {useState} from 'react';
import {Menu} from '../components';


const Login = ({location, history}) => {
  
  const [nickname, setNickName] = useState('');

  console.log('Login에서 호출됨');

  const onChange = (e) =>{
    setNickName(e.target.value);
  }

  const onClick = () =>{
    history.push({
      pathname : '/',
      state: {nickname : nickname},
    });
  }

  return (
    <div>
      <Menu />
      <h1>로그인</h1>
      <ul>
        <li>
          <div>
            <h3>What's your nickname?</h3>
            <input onChange={onChange} value={nickname} type="text"
              onKeyPress={(e)=>{
                if (e.key === 'Enter')
                  onClick();
              }}/>
            <button onClick={onClick}>입장</button>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default Login;