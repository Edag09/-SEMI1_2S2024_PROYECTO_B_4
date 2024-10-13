import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Registro from './Components/Registro/Ruser'
import Login from './Components/Login/Login';
import './App.css';

const App = () => {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="registro" element={<Registro/>}/>
                </Routes>
            </div>
        </Router>
    );
}

export default App;
