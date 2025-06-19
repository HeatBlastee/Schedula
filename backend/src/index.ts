import "dotenv/config";
import "./config/passport.config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors"; // Make sure cors is imported
import { config } from "./config/app.config";
import { HTTPSTATUS } from "./config/http.config";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import { asyncHandler } from "./middlewares/asyncHandler.middeware";
import { BadRequestException } from "./utils/app-error";
import { initializeDatabase } from "./database/database";
import authRoutes from "./routes/auth.route";
import passport from "passport";
import eventRoutes from "./routes/event.route";
import availabilityRoutes from "./routes/availability.route";
import integrationRoutes from "./routes/integration.route";
import meetingRoutes from "./routes/meeting.route";

const app = express();
const BASE_PATH = config.BASE_PATH;

// --- Place CORS middleware here, at the very beginning ---
app.use(cors({ origin: '*', credentials: true })); 
// --- Remove the app.options("*", cors(...)) line as it's often not needed ---

app.use(express.json()); // Keep one of these
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// app.use(express.json()); // Remove this duplicate

app.get(
  "/",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    throw new BadRequestException("throwing async error");
    res.status(HTTPSTATUS.OK).json({
      message: "Hello Subscribe to the channel",
    });
  })
);

app.use(`${BASE_PATH}/auth`, authRoutes);
app.use(`${BASE_PATH}/event`, eventRoutes);
app.use(`${BASE_PATH}/availability`, availabilityRoutes);
app.use(`${BASE_PATH}/integration`, integrationRoutes);
app.use(`${BASE_PATH}/meeting`, meetingRoutes);

app.use(errorHandler);

app.listen(config.PORT, async () => {
  await initializeDatabase();
  console.log(`Server listening on port ${config.PORT} in ${config.NODE_ENV}`);
});