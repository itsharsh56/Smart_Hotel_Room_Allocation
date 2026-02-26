import React from "react";

const getStatus = (room) => {
  if (room.isFull) return "full";
  if (room.allocatedStudents > 0) return "partial";
  return "available";
};

const RoomTable = ({ rooms }) => {
  return (
    <div className="panel">
      <h3>Room Inventory</h3>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Room No</th>
              <th>Capacity</th>
              <th>Occupied</th>
              <th>Available</th>
              <th>AC</th>
              <th>Washroom</th>
              <th>Occupancy</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => {
              const status = getStatus(room);
              const occupancyPercent = Math.round(
                (room.allocatedStudents / room.capacity) * 100
              );

              return (
                <tr key={room._id}>
                  <td>{room.roomNo}</td>
                  <td>{room.capacity}</td>
                  <td>{room.allocatedStudents}</td>
                  <td>{room.availableCapacity}</td>
                  <td>{room.hasAC ? "Yes" : "No"}</td>
                  <td>{room.hasAttachedWashroom ? "Yes" : "No"}</td>
                  <td>
                    <div className="progress-box">
                      <div
                        className={`progress-fill ${status}`}
                        style={{ width: `${occupancyPercent}%` }}
                      />
                    </div>
                    <small>{occupancyPercent}%</small>
                  </td>
                  <td>
                    <span className={`status ${status}`}>
                      {status === "available"
                        ? "Available"
                        : status === "partial"
                        ? "Partially Filled"
                        : "Full"}
                    </span>
                  </td>
                </tr>
              );
            })}
            {rooms.length === 0 && (
              <tr>
                <td colSpan="8" className="empty-row">
                  No rooms found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RoomTable;
