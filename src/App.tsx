import { usePacman } from 'hooks/usePacman';
import 'index.css';

function App() {
  usePacman();
  return (
    <>
      <h1>Pac-Man</h1>
      <canvas id="canvas"></canvas>
    </>
  );
}

export default App;
