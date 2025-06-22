import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './Components/Home';
import Invoice from './Components/Invoice';

function App() {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/invoice' element={<Invoice/>} />
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
