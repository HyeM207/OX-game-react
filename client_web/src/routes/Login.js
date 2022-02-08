import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Menu, socket} from '../components';


const Login = ({location, history }) => {

  const navigate = useNavigate();
  const [nickname, setNickName] = useState('');
 
  // console.log('Login에서 호출됨');

  const ONCHANGE = (e) =>{
    setNickName(e.target.value);
  }

  const ONCLICK = () =>{
    console.log('nickname:', nickname);

    navigate('/dynamic-web_OXGame',{state : {nickname : nickname}});

  }

  return (
    <div>
      <Menu />
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)"}}>
          <h3>Please Enter your nickname</h3> 
              <input onChange={ONCHANGE} value={nickname} type="text" class="form-control" placeholder="nickname" aria-label="nickname" aria-describedby="button-addon2" 
                onKeyPress={(e)=>{
                  if (e.key === 'Enter')
                  ONCLICK();
                }}/>
              <button onClick={ONCLICK} class="btn btn-primary" type="button" id="button-addon2" style={{ margin : "15px", width : "60%" }}>입장</button>
      </div>
    </div>
  );

};

export default Login;