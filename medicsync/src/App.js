import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Registro from './Components/Registro/Ruser'
import Login from './Components/Login/Login';
import Translator from './Components/Translator/Translator';
import './App.css';

const App = () => {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/registro" element={<Registro/>}/>
                    <Route path="/translator" element={<Translator />}/>
                </Routes>
            </div>
        </Router>
    );
}

export default App;
