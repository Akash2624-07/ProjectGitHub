import React from "react";
import ReactDOM from "react-dom/client";
import Header from "./Component/Header";
import Body from "./Component/Body";


function App(){

    return(
        <>
            <Header></Header>
            <Body></Body>
        </>
    )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);