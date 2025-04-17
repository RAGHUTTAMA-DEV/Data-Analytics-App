const jwt = require("jsonwebtoken");
const router = require("express").Router();
const { UserModel } = require("../models/Schema");
const { UploadDataModel, AnalyticsModel } = require("../models/Schema");  
const aq = require("arquero");

router.post('/upload', async (req, res) => {
  try {
    const { datasetName, rawData } = req.body;
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decoded.id || decoded._id;
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const uploadData = await UploadDataModel.create({
      user: userId,
      datasetName,
      rawData: Array.isArray(rawData) ? rawData : [] // Ensure rawData is an array
    });

    const id = uploadData._id;
    const analyticsData = await getAnalytics(uploadData.rawData);
    await AnalyticsModel.create({
      user: userId,
      dataset: id,
      matrics: analyticsData
    });
    res.status(201).json({ message: "Data uploaded successfully", uploadData, id });
  } catch (err) {
    console.error("Error in /upload:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/analytics/:datasetId", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id || decoded._id;

    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const { datasetId } = req.params;

    // Validate datasetId
    if (!datasetId || !datasetId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: "Invalid dataset ID" });
    }

    const uploadData = await UploadDataModel.findById(datasetId);
    if (!uploadData) return res.status(404).json({ error: "Data not found" });

    const data = uploadData.rawData;

    // Validate rawData
    if (!Array.isArray(data) || data.length === 0) {
      return res.status(400).json({ error: "Invalid or empty dataset" });
    }

    const analytics = await getAnalytics(data);
    res.json({ analytics });
  } catch (err) {
    console.error("Error in /analytics/:datasetId:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/bulk", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id || decoded._id;
    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
     
    const uploadData = await UploadDataModel.find({ user: userId });
    res.status(200).json({ uploadData });
  } catch (err) {
    console.error("Error in /bulk:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get('/bulk/analytics', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id || decoded._id;
    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Get all analytics for the user
    const analytics = await AnalyticsModel.find({ user: userId })
      .populate('dataset')
      .exec();

    if (!analytics || analytics.length === 0) {
      return res.status(404).json({ error: "No analytics found for this user" });
    }

    res.status(200).json({ analytics });
  } catch (err) {
    console.error("Error in /bulk/analytics:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

async function getAnalytics(data) {
  const df = aq.from(data);

  // Generate basic column-wise stats
  const columns = df.columnNames();
  const summary = {};

  columns.forEach(col => {
    const series = df.array(col).filter(val => typeof val === "number"); // numeric only

    if (series.length > 0) {
      const mean = aq.op.mean(series);
      const min = aq.op.min(series);
      const max = aq.op.max(series);
      const range = max - min;
      const count = series.length;
      const std = Math.sqrt(
        series.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / count
      );

      summary[col] = { count, mean, min, max, range, std };
    }
  });

  return summary;
}

module.exports = router;
