import React, { useEffect, useMemo, useState } from "react";
import { roomApi } from "./api/room.api";
import Dashboard from "./components/Dashboard";
import AddRoomForm from "./components/AddRoomForm";
import RoomTable from "./components/RoomTable";
import SearchAndAllocate from "./components/SearchAndAllocate";
import AllocationLogs from "./components/AllocationLogs";
import "./styles.css";

const navItems = ["Dashboard", "Add Room", "Allocate Room", "Logs"];

const App = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [rooms, setRooms] = useState([]);
  const [logs, setLogs] = useState([]);
  const [message, setMessage] = useState({ type: "", text: "" });

  const notify = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => {
      setMessage({ type: "", text: "" });
    }, 3500);
  };

  const loadRooms = async () => {
    const response = await roomApi.getRooms();
    setRooms(response.data);
  };

  const loadLogs = async () => {
    const response = await roomApi.getLogs();
    setLogs(response.data);
  };

  const bootstrap = async () => {
    try {
      await Promise.all([loadRooms(), loadLogs()]);
    } catch (error) {
      notify("error", error.message);
    }
  };

  useEffect(() => {
    bootstrap();
  }, []);

  const stats = useMemo(() => {
    const totalRooms = rooms.length;
    const totalCapacity = rooms.reduce((sum, room) => sum + room.capacity, 0);
    const availableCapacity = rooms.reduce(
      (sum, room) => sum + room.availableCapacity,
      0
    );
    const occupiedCapacity = totalCapacity - availableCapacity;

    return { totalRooms, totalCapacity, occupiedCapacity, availableCapacity };
  }, [rooms]);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h1>Smart Hostel</h1>
        {navItems.map((item) => (
          <button
            key={item}
            className={activeTab === item ? "active" : ""}
            onClick={() => setActiveTab(item)}
          >
            {item}
          </button>
        ))}
      </aside>

      <main className="main-panel">
        <header className="header">
          <h2>{activeTab}</h2>
          {message.text && (
            <div className={`toast ${message.type}`}>{message.text}</div>
          )}
        </header>

        <Dashboard stats={stats} />

        {activeTab === "Dashboard" && <RoomTable rooms={rooms} />}

        {activeTab === "Add Room" && (
          <AddRoomForm
            notify={notify}
            onAdded={async () => {
              await loadRooms();
            }}
          />
        )}

        {activeTab === "Allocate Room" && (
          <SearchAndAllocate
            notify={notify}
            onRefresh={async () => {
              await Promise.all([loadRooms(), loadLogs()]);
            }}
          />
        )}

        {activeTab === "Logs" && <AllocationLogs logs={logs} />}
      </main>
    </div>
  );
};

export default App;
