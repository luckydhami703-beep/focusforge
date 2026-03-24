import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import TaskManager from "./components/TaskManager";
import "./style.css";

function App() {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Dashboard />
        <TaskManager />
      </div>
    </div>
  );
}

export default App;