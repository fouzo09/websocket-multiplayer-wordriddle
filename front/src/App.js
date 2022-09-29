import { Route, Routes } from "react-router-dom";
import EndView from "./views/EndView";
import GameView from "./views/GameView";
import StartView from "./views/StartView";

function App() {
  return (
    <Routes>
      <Route path='/' element={<StartView />} />
      <Route path='/:gameID' element={<GameView />} />
      <Route path='game' element={<GameView />} />
      <Route path='end' element={<EndView />} />
    </Routes>
  );
}

export default App;
