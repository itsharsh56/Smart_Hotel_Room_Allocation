const roomService = require("../services/room.service");

const parseBoolean = (value) => {
  if (value === undefined) return undefined;
  if (value === "true" || value === true) return true;
  if (value === "false" || value === false) return false;
  return undefined;
};

const sendSuccess = (res, message, data = {}) => {
  return res.status(200).json({ success: true, message, data });
};

const createRoom = async (req, res, next) => {
  try {
    const { roomNo, capacity, hasAC, hasAttachedWashroom } = req.body;

    if (!roomNo || !capacity || typeof hasAC !== "boolean" || typeof hasAttachedWashroom !== "boolean") {
      const error = new Error("Invalid room payload.");
      error.statusCode = 400;
      throw error;
    }

    const room = await roomService.createRoom({
      roomNo,
      capacity: Number(capacity),
      hasAC,
      hasAttachedWashroom,
    });

    return res.status(201).json({
      success: true,
      message: "Room added successfully.",
      data: room,
    });
  } catch (error) {
    next(error);
  }
};

const getRooms = async (req, res, next) => {
  try {
    const rooms = await roomService.getRooms();
    return sendSuccess(res, "Rooms fetched successfully.", rooms);
  } catch (error) {
    next(error);
  }
};

const searchRooms = async (req, res, next) => {
  try {
    const filters = {
      minAvailableCapacity: req.query.minAvailableCapacity,
      hasAC: parseBoolean(req.query.hasAC),
      hasAttachedWashroom: parseBoolean(req.query.hasAttachedWashroom),
      isFull: parseBoolean(req.query.isFull),
    };

    const rooms = await roomService.searchRooms(filters);
    return sendSuccess(res, "Filtered rooms fetched successfully.", rooms);
  } catch (error) {
    next(error);
  }
};

const allocateRoom = async (req, res, next) => {
  try {
    const { students, needsAC, needsWashroom } = req.body;

    if (!students || students < 1 || typeof needsAC !== "boolean" || typeof needsWashroom !== "boolean") {
      const error = new Error("Invalid allocation payload.");
      error.statusCode = 400;
      throw error;
    }

    const result = await roomService.allocateRoom({
      students: Number(students),
      needsAC,
      needsWashroom,
    });

    return sendSuccess(res, "Room allocated successfully.", result);
  } catch (error) {
    next(error);
  }
};

const getAllocationLogs = async (req, res, next) => {
  try {
    const logs = await roomService.getAllocationLogs();
    return sendSuccess(res, "Allocation logs fetched successfully.", logs);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRoom,
  getRooms,
  searchRooms,
  allocateRoom,
  getAllocationLogs,
};
