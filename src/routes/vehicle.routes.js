import express from "express";
import { addVehicle, assignDriver, getVehicle } from "../controllers/vehicle.controller.js";
import { vehicleLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

router.post("/add", vehicleLimiter, addVehicle);
router.patch("/assign-driver/:vehicleId", assignDriver);
router.get("/:vehicleId", getVehicle);

export default router;
