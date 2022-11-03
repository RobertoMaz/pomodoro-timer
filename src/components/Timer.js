import { useContext, useEffect, useRef, useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import PauseBotton from './PauseBotton';
import PlayButton from './PlayButton';
import SettingsButton from './SettingsButton';
import SettingContext from './SettingsContext';


function Timer() {

    const settingsInfo = useContext(SettingContext);

    const [isPause, setIsPause] = useState(true);
    const [secondsLeft, setsecondsLeft] = useState(0);
    const [mode, setMode] = useState("break");

    const secondsLeftRef = useRef(secondsLeft);
    const isPauseRef = useRef(isPause);
    const modeRef = useRef(mode);

    const red = "#f54e4e";
    const green = "#4aec8c"
    const totalSeconds = mode === "work" 
        ? settingsInfo.workMinutes *60 
        : settingsInfo.breakMinutes * 60;
    const percentage = Math.round(secondsLeft / totalSeconds * 100);
    const minutes = Math.floor(secondsLeft / 60);
    let seconds = secondsLeft % 60;

    if(seconds < 10) seconds = "0" + seconds;

    function initTimer(){
        setsecondsLeft(settingsInfo.workMinutes * 60);
    }
    
    function switchMode(){
        const nextMode = modeRef.current === "work" ? "break" : "work";
        const nextSeconds = (nextMode === "work" ? settingsInfo.workMinutes : settingsInfo.breakMinutes) * 60; 

        setMode(nextMode);
        modeRef.current = nextMode;
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
                return switchMode();
            }

            tick();
        }, 1000);
        return () => clearInterval(interval);
    },[]);

    return (
        <div>
            <CircularProgressbar 
                value={percentage} 
                text={minutes + ":" + seconds} 
                styles={buildStyles({
                    textColor: "#fff",
                    pathColor: mode === "work" ? red : green,
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