const path = require("path");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const mongoURI = "mongodb://localhost:27017/userDB"; // Replace with your MongoDB URI

// Connect to MongoDB
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Create a Mongoose schema and model for user
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  emailId: { type: String, required: true, unique: true },
  profession: { type: String, required: true },
  currentDegree: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

// Endpoint to create a new user
app.post("/users", async (req, res) => {
  const { name, emailId, profession, currentDegree } = req.body;

  // Validate input
  if (!name || !emailId || !profession || !currentDegree) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Create a new user
    const newUser = new User({ name, emailId, profession, currentDegree });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "EmailId already exists" });
    }
    res.status(500).json({ error: "Server error" });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

/*
app.get("/all", async (req, res) => {
  const getAllDeatilsQuery = `
        SELECT * FROM USER_DETAILS;
    `;
  try {
    const allDetails = await db.all(getAllDeatilsQuery);
    res.send({ Data: allDetails });
  } catch (e) {
    res.send({ Error: `Error at ${e.message}` });
  }
});

app.post("/uploads", async (request, response) => {
  const { name, emailId, profession, currentDegree } = request.body;

  const newId = uuid.v4();
  const postNewDetailsQuery = `
        INSERT INTO USER_DETAILS(user_id,name,email_id,profession,current_degree)
        VALUES('${newId}','${name}','${emailId}','${profession}','${currentDegree}');
    `;
  try {
    await db.run(postNewDetailsQuery);
    response.status(200).send({ Success: "New Details uploaded" });
  } catch (e) {
    response.send({ Error: `Error at ${e.message}` });
  }
});
*/
