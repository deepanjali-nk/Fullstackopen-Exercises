import { useState } from "react";
import MyButton from "./MyButton";

const App=()=>{

    const [good,setGood]=useState(0);
    const [neutral,setNeutral]=useState(0);
    const [bad,setBad]=useState(0);


    const handleGood=()=>{
        setGood(good+1);
    }
    const handleNeutral=()=>{
        setNeutral(neutral+1);
    }

    const handleBad=()=>{
        setBad(bad+1);
    }
    return(
      <div>
        <h1>give feedback</h1>
        <MyButton handleClick={handleGood} text="good"/>
        <MyButton handleClick={handleNeutral} text="neutral"/>
        <MyButton handleClick={handleBad} text="bad"/>

        <h2>statistics</h2>
        <p>good {good}</p>
        <p>neutral {neutral}</p>
        <p>bad {bad}</p>

      </div>
    )
}
export default App;