import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import TestBootstrap from './components/TestBootstrap';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TestBootstrap />} /> 
        <Route path="/register" element={<Register />} /> 
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;