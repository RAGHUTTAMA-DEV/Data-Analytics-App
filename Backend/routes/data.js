const jwt = require("jsonwebtoken");
const router = require("express").Router();
const {UserModel} = require("../models/Schema");
const {UploadDataModel} = require("../models/Schema");

router.post('/upload', async (req, res) => {
  try {
    const { datasetName, rawData } = req.body;
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decoded.id || decoded._id; // depends on how you sign the token
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const uploadData = await UploadDataModel.create({
      user: userId,
      datasetName,
      rawData
    });
    const id = uploadData._id;

    res.status(201).json({ message: "Data uploaded successfully", uploadData,id });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});



router.get('/analytics/:datasetId', async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      const datasetId = req.params.datasetId;
  
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
  
      const uploadData = await UploadDataModel.findById(datasetId);
      if (!uploadData) {
        return res.status(404).json({ error: "Data not found" });
      }
  
      const data = uploadData.rawData;
  
      // Choose a numeric field to analyze
      const revenueValues = data.map(row => row.revenue).filter(val => typeof val === "number");
  
      const total = revenueValues.reduce((a, b) => a + b, 0);
      const avg = total / revenueValues.length;
      const min = Math.min(...revenueValues);
      const max = Math.max(...revenueValues);
      const range = max - min;
      const sorted = [...revenueValues].sort((a, b) => a - b);
      const median = sorted[Math.floor(sorted.length / 2)];
  
      // Mode
      const mode = revenueValues.sort((a, b) =>
        revenueValues.filter(v => v === a).length - revenueValues.filter(v => v === b).length
      ).pop();
  
      // Variance and Standard Deviation
      const variance = revenueValues.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / revenueValues.length;
      const standardDeviation = Math.sqrt(variance);
  
      const analytics = {
        totalRecords: data.length,
        avgRevenue: avg,
        minRevenue: min,
        maxRevenue: max,
        range,
        median,
        mode,
        variance,
        standardDeviation,
      };
  
      res.status(200).json({ analytics });
  
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  


module.exports=router;