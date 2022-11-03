import { useState } from 'react';
import './App.css';
import Settings from './components/Settings';
import SettingContext from './components/SettingsContext';
import Timer from './components/Timer';

function App() {

  const [showSettings, setShowSettings] = useState(false);
  const [workMinutes, setWorkMinutes] = useState(45);
  const [breakMinutes, setBreakMinutes] = useState(15);


  return (
    <main>
      <SettingContext.Provider value={{
        showSettings,
        setShowSettings,
        workMinutes,
        setWorkMinutes,
        breakMinutes,
        setBreakMinutes
      }}>
        {showSettings ? <Settings /> : <Timer />}

      </SettingContext.Provider>
      
      
    </main>
  );
}

export default App;
