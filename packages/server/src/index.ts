import express, { Request, Response } from "express";
import { Trip } from "models";
import { ItineraryPage } from "./pages/itinerary";
import { getTrip } from "./services/itinerary-svc";
import { connect } from "./services/mongo";

connect("backpack"); // use your own db name here

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";

app.use(express.static(staticDir));

app.get("/hello", (req: Request, res: Response) => {
  res.send("Hello, World");
});

app.get("/itinerary/:tripId", (req: Request, res: Response) => {
  const { tripId } = req.params;
  const data: Trip = getTrip(tripId);
  const page = new ItineraryPage(data);

  res.set("Content-Type", "text/html").send(page.render());
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
