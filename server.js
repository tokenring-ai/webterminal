import express from "express";
import cookieParser from "cookie-parser";
import { auth } from "@auth/core";
import GoogleProvider from "@auth/core/providers/google";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cookieParser());
app.use(express.json());
app.all("/api/auth/:next*", async (req, res) => {
	// Auth.js handler
	return auth({
		providers: [
			GoogleProvider({
				clientId: process.env.GOOGLE_ID,
				clientSecret: process.env.GOOGLE_SECRET,
			}),
		],
		secret: process.env.AUTH_SECRET,
		trustHost: true,
		basePath: "/api/auth",
	})(req, res);
});

const port = process.env.AUTH_PORT || 3001;
app.listen(port, () => {
	console.log(`Auth server listening on http://localhost:${port}/api/auth`);
});
