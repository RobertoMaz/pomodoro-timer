import { useContext, useEffect, useRef, useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import PauseBotton from './PauseBotton';
import PlayButton from './PlayButton';
import SettingsButton from './SettingsButton';
import SettingContext from './SettingsContext';

const red = "#f54e4e";
const green = "#4aec8c"


function Timer() {

    const settingsInfo = useContext(SettingContext);

    const [isPause, setIsPause] = useState(null);
    const [secondsLeft, setsecondsLeft] = useState(0);
    const [node, setNode] = useState("break");

    const secondsLeftRef = useRef(secondsLeft);
    const isPauseRef = useRef(isPause);
    const nodeRef = useRef(node);

   
 
    

    function initTimer(){
        setsecondsLeft(settingsInfo.workMinutes * 60);
    }
    
    function switchMode(){
        console.log("swit");
        const nextMode = nodeRef.current === "work" ? "break" : "work";
        const nextSeconds = (nextMode === "work" ? settingsInfo.workMinutes : settingsInfo.breakMinutes) * 60; 

        setNode(nextMode);
        nodeRef.current = nextMode;
        setsecondsLeft(nextSeconds)
        secondsLeftRef.current = nextSeconds;
    }

    function tick(){
        secondsLeftRef.current--;
        setsecondsLeft(secondsLeftRef.current);
    }
    
    
    
    useEffect(() => {
        initTimer();
        
        const interval = setInterval(() => {
            
            if(isPauseRef.current){              
                return;
            }
            
            if(secondsLeftRef.current === 0){
                console.log("switmodeinterval");
                return switchMode();
            }

            tick();

        }, 1000);

        return () => clearInterval(interval);
    },[]);


    const totalSeconds = node === "work" 
        ? settingsInfo.workMinutes *60 
        : settingsInfo.breakMinutes * 60;
    const percentage = Math.round(secondsLeft / totalSeconds * 100);
    const minutes = Math.floor(secondsLeft / 60);
    let seconds = secondsLeft % 60;

    if(seconds < 10) seconds = "0" + seconds;



    return (
        <div>
            <CircularProgressbar 
                value={percentage} 
                text={minutes + ":" + seconds} 
                styles={buildStyles({
                    textColor: "#fff",
                    pathColor: node === "work" ? red : green,
                    trailColor: "rgba(255, 255, 255, 0.2)"    
                })}
            />
            <div style={{marginTop: "20px"}}>

                {isPause 
                    ? <PlayButton onClick={() => {setIsPause(false); isPauseRef.current = false;}} /> 
                    : <PauseBotton  onClick={() => {setIsPause(true); isPauseRef.current = true;}}/> }
                
                
            </div>
            <div style={{marginTop: "20px"}}>
                <SettingsButton onClick={() => {settingsInfo.setShowSettings(true)}}/>
            </div>
        </div>
    );
}

export default Timer;