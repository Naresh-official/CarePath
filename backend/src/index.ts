import connectDB from "./utils/db.js";
import app from "./app.js";

connectDB()
	.then(() => {
		const port = process.env.PORT || 8000;
		const server = app.listen(port, () => {
			console.log(`Server running on port ${port}`);
		});

		server.on("error", (error: Error) => {
			console.error("Server error: ", error);
			throw error;
		});
	})
	.catch((error: Error) => {
		console.error("Error connecting to MongoDB : ", error);
		process.exit(1);
	});
