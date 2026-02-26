import React from "react";

const AllocationLogs = ({ logs }) => {
  return (
    <div className="panel">
      <h3>Allocation Logs</h3>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Students</th>
              <th>Needs AC</th>
              <th>Needs Washroom</th>
              <th>Allocated Room</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log._id}>
                <td>{new Date(log.timestamp).toLocaleString()}</td>
                <td>{log.students}</td>
                <td>{log.needsAC ? "Yes" : "No"}</td>
                <td>{log.needsWashroom ? "Yes" : "No"}</td>
                <td>{log.allocatedRoom}</td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan="5" className="empty-row">
                  No logs available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllocationLogs;
