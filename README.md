# Smart Hostel Room Allocation System

Production-ready full-stack web application for hostel room inventory management and optimized room allocation.

## Project Overview

The system manages room inventory, supports filtered room search, and performs automatic allocation using a greedy best-fit strategy.

## System Architecture

```text
+----------------------+        HTTP/JSON         +--------------------------+
| React Frontend       |  <-------------------->  | Express REST API         |
| (Vite, Hooks, UI)    |                          | (Controller + Service)   |
+----------------------+                          +--------------------------+
                                                              |
                                                              | Mongoose
                                                              v
                                                   +--------------------------+
                                                   | MongoDB                  |
                                                   | rooms, allocation_logs   |
                                                   +--------------------------+
```

## Allocation Algorithm

Greedy optimization (best-fit):

1. Filter rooms where:
   - `availableCapacity >= students`
   - `hasAC === needsAC`
   - `hasAttachedWashroom === needsWashroom`
2. Sort filtered rooms by:
   - `availableCapacity` ascending
   - `roomNo` ascending
3. Pick the first room (smallest suitable room).
4. Update room occupancy fields:
   - `allocatedStudents += students`
   - `availableCapacity = capacity - allocatedStudents`
   - `isFull = availableCapacity === 0`
5. Save allocation log.
6. If no room is found, return structured error response.

## API Endpoints

Base URL: `/api/rooms`

- `POST /api/rooms` - Add room
- `GET /api/rooms` - List all rooms
- `GET /api/rooms/search` - Search rooms with filters
- `POST /api/rooms/allocate` - Auto-allocate room
- `GET /api/rooms/logs` - Fetch allocation logs

Response format:

```json
{
  "success": true,
  "message": "...",
  "data": {}
}
```

## Setup Instructions

### 1. Backend setup

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

### 2. Frontend setup

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

Frontend default: `http://localhost:5173`
Backend default: `http://localhost:5000`

## Deployment Instructions

### Backend on Render

1. Create a new Web Service from `server/`.
2. Build command: `npm install`
3. Start command: `npm start`
4. Add environment variables:
   - `MONGO_URI`
   - `PORT`
   - `CLIENT_URL` (Vercel frontend URL)

### Frontend on Vercel

1. Import project and set root directory to `client/`.
2. Build command: `npm run build`
3. Output directory: `dist`
4. Add env variable:
   - `VITE_API_BASE_URL=https://<your-render-service>/api`

## Folder Structure

```text
server/
  config/db.js
  models/room.model.js
  models/log.model.js
  controllers/room.controller.js
  services/room.service.js
  routes/room.routes.js
  middleware/errorHandler.js
  app.js
  server.js
  package.json

client/src/
  api/room.api.js
  components/
    Dashboard.jsx
    AddRoomForm.jsx
    RoomTable.jsx
    SearchAndAllocate.jsx
    AllocationLogs.jsx
  App.jsx
  main.jsx
```

## Future Enhancements

- Role-based admin authentication
- Allocation conflict handling with stronger concurrency controls
- Exportable reporting (CSV/PDF)
- Room-level maintenance and out-of-service states
- Analytics dashboard with trend charts
