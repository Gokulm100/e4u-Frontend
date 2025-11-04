
import './App.css';
import Landing from './pages/landing';
function App() {
  return (
    <div className="App">
      {/* <Navbar></Navbar>
      <Home></Home> */}
      <Landing></Landing>
    </div>
  );
}
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js').then(registration => {
    // Check for updates on every page load
    registration.update();
  });
}
export default App;
