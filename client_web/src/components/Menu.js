import React from 'react';
import {Link} from 'react-router-dom';

const Menu = () =>{
    return(
        <div>
            <ul>
                <li><Link to="/dynamic-web_OXGame/login">Login</Link></li>
                <li><Link to="/dynamic-web_OXGame/">Home</Link></li>
                <li><Link to="/dynamic-web_OXGame/main">Main</Link></li>
                <li><Link to="/dynamic-web_OXGame/insert">Insert</Link></li>
            </ul>
            <hr/>
        </div>
    );
}

export default Menu;