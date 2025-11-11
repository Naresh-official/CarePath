import express, { Express, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
	cors({
		origin: process.env.FRONTEND_URL,
		credentials: true,
	})
);
app.use(cookieParser());

app.get("/api/health", (req: Request, res: Response) => {
	res.status(200).json({ status: "OK", message: "Server is healthy" });
});

export default app;
