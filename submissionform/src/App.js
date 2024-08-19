import logo from './logo.svg';
import './App.css';
import Header from './components/Header';
import { Inputs } from './components/Inputs';

function App() {
  return (
    <div className="App flex items-center justify-center min-h-screen bg-gray-800">
      <div className="cardContainer bg-white shadow-xl rounded-lg p-6 w-80">
        <Header />
        <Inputs />
      </div>
    </div>
  );
}

export default App;
