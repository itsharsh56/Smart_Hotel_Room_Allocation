import React, { useState } from "react";
import { roomApi } from "../api/room.api";

const initialState = {
  roomNo: "",
  capacity: "",
  hasAC: false,
  hasAttachedWashroom: false,
};

const AddRoomForm = ({ onAdded, notify }) => {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.roomNo.trim()) {
      notify("error", "Room number is required.");
      return;
    }

    if (!form.capacity || Number(form.capacity) < 1) {
      notify("error", "Capacity must be at least 1.");
      return;
    }

    try {
      setLoading(true);
      await roomApi.addRoom({
        roomNo: form.roomNo.trim(),
        capacity: Number(form.capacity),
        hasAC: form.hasAC,
        hasAttachedWashroom: form.hasAttachedWashroom,
      });
      notify("success", "Room added successfully.");
      setForm(initialState);
      onAdded();
    } catch (error) {
      notify("error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="panel" onSubmit={handleSubmit}>
      <h3>Add Room</h3>

      <label>
        Room Number
        <input
          name="roomNo"
          value={form.roomNo}
          onChange={handleChange}
          placeholder="A-101"
        />
      </label>

      <label>
        Capacity
        <input
          name="capacity"
          type="number"
          min="1"
          value={form.capacity}
          onChange={handleChange}
          placeholder="4"
        />
      </label>

      <label className="inline-label">
        <input
          name="hasAC"
          type="checkbox"
          checked={form.hasAC}
          onChange={handleChange}
        />
        AC Available
      </label>

      <label className="inline-label">
        <input
          name="hasAttachedWashroom"
          type="checkbox"
          checked={form.hasAttachedWashroom}
          onChange={handleChange}
        />
        Attached Washroom
      </label>

      <button disabled={loading} type="submit">
        {loading ? "Saving..." : "Add Room"}
      </button>
    </form>
  );
};

export default AddRoomForm;
