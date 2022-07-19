import { EthProvider } from "./contexts/EthContext";
import Panel from './components/Panel';
import "./App.css";

function App() {
  return (
    <EthProvider>
      <div id="App" >
        <div className="container">
          <Panel />
        </div>
      </div>
    </EthProvider>
  );
}

export default App;
