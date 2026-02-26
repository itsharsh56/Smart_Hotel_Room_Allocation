const Room = require("../models/room.model");
const AllocationLog = require("../models/log.model");

const buildRoomFilters = (filters = {}) => {
  const query = {};

  if (filters.minAvailableCapacity) {
    query.availableCapacity = { $gte: Number(filters.minAvailableCapacity) };
  }

  if (typeof filters.hasAC === "boolean") {
    query.hasAC = filters.hasAC;
  }

  if (typeof filters.hasAttachedWashroom === "boolean") {
    query.hasAttachedWashroom = filters.hasAttachedWashroom;
  }

  if (typeof filters.isFull === "boolean") {
    query.isFull = filters.isFull;
  }

  return query;
};

const createRoom = async (payload) => {
  return Room.create(payload);
};

const getRooms = async () => {
  return Room.find({}).sort({ roomNo: 1 }).lean();
};

const searchRooms = async (filters) => {
  const query = buildRoomFilters(filters);
  return Room.find(query)
    .sort({ availableCapacity: 1, roomNo: 1 })
    .lean();
};

const allocateRoom = async ({ students, needsAC, needsWashroom }) => {
  const session = await Room.startSession();
  session.startTransaction();

  try {
    // Greedy allocation:
    // 1) Filter by constraints.
    // 2) Sort by smallest available capacity then room number.
    // 3) Allocate the first matching room (best fit).
    const room = await Room.findOne({
      availableCapacity: { $gte: students },
      hasAC: needsAC,
      hasAttachedWashroom: needsWashroom,
    })
      .sort({ availableCapacity: 1, roomNo: 1 })
      .session(session);

    if (!room) {
      const error = new Error("No suitable room found for the requested allocation.");
      error.statusCode = 404;
      throw error;
    }

    room.allocatedStudents += students;
    room.availableCapacity = room.capacity - room.allocatedStudents;
    room.isFull = room.availableCapacity === 0;
    await room.save({ session });

    const [log] = await AllocationLog.create(
      [
        {
          students,
          needsAC,
          needsWashroom,
          allocatedRoom: room.roomNo,
        },
      ],
      { session }
    );

    await session.commitTransaction();

    return {
      room,
      log,
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const getAllocationLogs = async () => {
  return AllocationLog.find({}).sort({ timestamp: -1 }).lean();
};

module.exports = {
  createRoom,
  getRooms,
  searchRooms,
  allocateRoom,
  getAllocationLogs,
};
