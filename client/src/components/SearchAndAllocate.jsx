import React, { useState } from "react";
import { roomApi } from "../api/room.api";

const SearchAndAllocate = ({ onRefresh, notify }) => {
  const [search, setSearch] = useState({
    minAvailableCapacity: "",
    hasAC: "",
    hasAttachedWashroom: "",
  });
  const [allocation, setAllocation] = useState({
    students: "",
    needsAC: false,
    needsWashroom: false,
  });
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearch((prev) => ({ ...prev, [name]: value }));
  };

  const handleAllocationChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAllocation((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const runSearch = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await roomApi.searchRooms(search);
      setSearchResults(response.data);
      notify("success", `Found ${response.data.length} rooms.`);
    } catch (error) {
      notify("error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const allocate = async (e) => {
    e.preventDefault();

    if (!allocation.students || Number(allocation.students) < 1) {
      notify("error", "Students must be at least 1.");
      return;
    }

    try {
      setLoading(true);
      const response = await roomApi.allocateRoom({
        students: Number(allocation.students),
        needsAC: allocation.needsAC,
        needsWashroom: allocation.needsWashroom,
      });
      notify("success", `Allocated to room ${response.data.room.roomNo}.`);
      onRefresh();
    } catch (error) {
      notify("error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="two-col">
      <form className="panel" onSubmit={runSearch}>
        <h3>Search Rooms</h3>
        <label>
          Min Available Capacity
          <input
            type="number"
            min="0"
            name="minAvailableCapacity"
            value={search.minAvailableCapacity}
            onChange={handleSearchChange}
          />
        </label>

        <label>
          AC Preference
          <select name="hasAC" value={search.hasAC} onChange={handleSearchChange}>
            <option value="">Any</option>
            <option value="true">AC</option>
            <option value="false">Non-AC</option>
          </select>
        </label>

        <label>
          Washroom Preference
          <select
            name="hasAttachedWashroom"
            value={search.hasAttachedWashroom}
            onChange={handleSearchChange}
          >
            <option value="">Any</option>
            <option value="true">Attached</option>
            <option value="false">Common</option>
          </select>
        </label>

        <button disabled={loading} type="submit">
          {loading ? "Searching..." : "Search"}
        </button>

        <div className="result-list">
          {searchResults.map((room) => (
            <p key={room._id}>
              {room.roomNo}: {room.availableCapacity} seats available
            </p>
          ))}
          {searchResults.length === 0 && <small>No search results yet.</small>}
        </div>
      </form>

      <form className="panel" onSubmit={allocate}>
        <h3>Auto Allocate</h3>
        <label>
          Students
          <input
            name="students"
            type="number"
            min="1"
            value={allocation.students}
            onChange={handleAllocationChange}
          />
        </label>

        <label className="inline-label">
          <input
            name="needsAC"
            type="checkbox"
            checked={allocation.needsAC}
            onChange={handleAllocationChange}
          />
          Needs AC
        </label>

        <label className="inline-label">
          <input
            name="needsWashroom"
            type="checkbox"
            checked={allocation.needsWashroom}
            onChange={handleAllocationChange}
          />
          Needs Attached Washroom
        </label>

        <button disabled={loading} type="submit">
          {loading ? "Allocating..." : "Allocate Room"}
        </button>
      </form>
    </div>
  );
};

export default SearchAndAllocate;
