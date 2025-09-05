import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";

const app = express();
app.use(cors());

const uri = "mongodb://127.0.0.1:27017"; // local Mongo
const client = new MongoClient(uri);

let db;
client.connect().then(() => {
  db = client.db("myDB"); // same DB you imported into
  console.log("✅ Connected to MongoDB");
});

// -------------------------
// Routes
// -------------------------

// Test route
app.get("/", (req, res) => {
  res.send("✅ Backend is running");
});

// Regression results (already imported)
app.get("/api/models", async (req, res) => {
  try {
    const docs = await db.collection("models").find().toArray();
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Dataset: head (first 10 rows)
app.get("/api/data/head", async (req, res) => {
  try {
    const docs = await db.collection("trips").find().limit(10).toArray();
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Dataset: columns (keys of first doc)
app.get("/api/data/columns", async (req, res) => {
  try {
    const doc = await db.collection("trips").findOne();
    res.json(doc ? Object.keys(doc) : []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -------------------------
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
