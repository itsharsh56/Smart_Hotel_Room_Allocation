const express = require("express");
const roomController = require("../controllers/room.controller");

const router = express.Router();

router.post("/", roomController.createRoom);
router.get("/", roomController.getRooms);
router.get("/search", roomController.searchRooms);
router.post("/allocate", roomController.allocateRoom);
router.get("/logs", roomController.getAllocationLogs);

module.exports = router;
