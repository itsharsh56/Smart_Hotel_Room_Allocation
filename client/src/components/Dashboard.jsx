import React from "react";

const Dashboard = ({ stats }) => {
  const items = [
    { label: "Total Rooms", value: stats.totalRooms },
    { label: "Total Capacity", value: stats.totalCapacity },
    { label: "Occupied Capacity", value: stats.occupiedCapacity },
    { label: "Available Capacity", value: stats.availableCapacity },
  ];

  return (
    <div className="stats-grid">
      {items.map((item) => (
        <div className="card" key={item.label}>
          <p className="card-label">{item.label}</p>
          <h2 className="card-value">{item.value}</h2>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
