import { usePacman } from 'hooks/usePacman';
import 'index.css';

function App() {
  usePacman();
  return <canvas id="canvas"></canvas>;
}

export default App;
