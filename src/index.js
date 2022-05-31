import React, {useState} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Authorize from "./routes/authorize";
import SnippetView from "./routes/snippet";
import SnippetsPopup from "./components/SnippetsPopup";
import Header from "./components/ui/Header";

const root = ReactDOM.createRoot(document.getElementById('root'));

function AppRouter() {
    const [showPopup, setShowPopup] = useState(false);
    const [popupUsername, setPopupUsername] = useState(null);
    const showPopupWith = (username) => {
        setPopupUsername(username);
        setShowPopup(true);
    }
    const closePopup = () => setShowPopup(false);
    const popup = [showPopupWith, closePopup]
    return (
        <BrowserRouter>
            {showPopup && <SnippetsPopup username={popupUsername} onClose={closePopup}/>}
            <Routes>
                <Route path="/" element={<App popup={popup}/>}/>
                <Route path="/authorize" element={<Authorize/>}/>
                <Route path="/@:username/:snippet" element={<SnippetView popup={popup}/>}/>
            </Routes>
        </BrowserRouter>
    )
}

root.render(
    <React.StrictMode>
        <AppRouter/>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
