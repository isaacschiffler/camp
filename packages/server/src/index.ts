import express, { Request, Response } from "express";
import { Trip } from "models";
import { ItineraryPage } from "./pages/itinerary";
import { LoginPage } from "./pages/auth";

// import { getTrip } from "./services/itinerary-svc";
import { connect } from "./services/mongo";
import Trips from "./services/itinerary-svc";
import itineraries from "./routes/itineraries";
import campsites from "./routes/campsites";
import regions from "./routes/regions";
import auth, { authenticateUser } from "./routes/auth";

connect("backpack"); // use your own db name here

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";

app.use(express.static(staticDir));
app.use(express.json());

app.use("/auth", auth);
app.use("/api/itineraries", itineraries);
app.use("/api/campsites", campsites);
app.use("/api/regions", regions);

app.get("/hello", (req: Request, res: Response) => {
  res.send("Hello, World");
});

app.get("/itinerary/:tripId", (req: Request, res: Response) => {
  const { tripId } = req.params;
  //   const data: Trip = getTrip(tripId);
  //   const page = new ItineraryPage(data);
  Trips.get(tripId)
    .then((data) => {
      res
        .set("Content-Type", "text/html")
        .send(new ItineraryPage(data).render());
    })
    .catch((err) => {
      res.status(404).send("Trip not found: " + err);
    });

  //   res.set("Content-Type", "text/html").send(page.render());
});

app.get("/login", (req: Request, res: Response) => {
  const page = new LoginPage();
  res.set("Content-Type", "text/html").send(page.render());
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
