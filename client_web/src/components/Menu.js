import React from 'react';
import {Link} from 'react-router-dom';
import '../css/bootstrap.min.css'

const Menu = () =>{
    return(
        // <div>
        //     <ul>
        //         <li><Link to="/dynamic-web_OXGame/login">Login</Link></li>
        //         <li><Link to="/dynamic-web_OXGame">Home</Link></li>
        //         <li><Link to="/dynamic-web_OXGame/main">Main</Link></li>
        //     </ul>
        //     <hr/>
        // </div>

        <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <div class="container-fluid">
            <a class="navbar-brand" href="#">OX Survival Game</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarColor01">
            <ul class="navbar-nav me-auto">
                <li class="nav-item">
                <a class="nav-link active" href="/dynamic-web_OXGame">Home
                    <span class="visually-hidden">(current)</span>
                </a>
                </li>
                <li class="nav-item">
                <a class="nav-link" href="/dynamic-web_OXGame/main">Main</a>
                </li>
                <li class="nav-item">
                <a class="nav-link" href="#">미정1</a>
                </li>
                <li class="nav-item">
                <a class="nav-link" href="#">미정2</a>
                </li>
              
            </ul>

            </div>
        </div>
        </nav>
    );
}

export default Menu;