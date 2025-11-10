
import './App.css';
import Landing from './pages/landing';
import { ToastProvider } from './components/ToastContext';
function App() {
  return (
    <ToastProvider>
      <div className="App">
        {/* <Navbar></Navbar>
        <Home></Home> */}
        <Landing></Landing>
      </div>
    </ToastProvider>
  );
}
export default App;
