import React, {useState} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Authorize from "./routes/authorize";
import SnippetView from "./routes/snippet";
import {SnippetContext} from "./context";
import useCurrentSnippet from "./hooks/useCurrentSnippet";

const root = ReactDOM.createRoot(document.getElementById('root'));

function AppRouter() {
    const [snippet, setSnippet] = useCurrentSnippet();
    return (
        <SnippetContext.Provider value={[snippet, setSnippet]}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<App/>}/>
                    <Route path="/authorize" element={<Authorize/>}/>
                    <Route path="/@:username/:snippet" element={<SnippetView/>}/>
                </Routes>
            </BrowserRouter>
        </SnippetContext.Provider>
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
