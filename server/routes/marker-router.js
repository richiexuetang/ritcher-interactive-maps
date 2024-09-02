const express = require("express");

const router = express.Router();
const db = require("../db");

router.get("/markers/area/:mapSlug", async (req, res) => {
  const { mapSlug } = req.params;
  let collection = await db.collection("markers");
  let results = await collection
    .find({ mapSlug: mapSlug })
    .sort({ lat: -1 })
    .toArray();

  res.send(results).status(200);
});

router.get("/markers/:mapSlug/:markerTypeId", async (req, res) => {
  const { mapSlug, markerTypeId } = req.params;
  let projection = {
    _id: 1,
    coordinate: 1,
    categoryId: 1,
    markerName: 1,
    description: 1,
    markerTypeId: 1,
  };
  if (markerTypeId == 2) {
    projection = { _id: 1, coordinate: 1, markerName: 1, zoomRange: 1 };
  } else if (markerTypeId == 3) {
    projection = { _id: 1, categoryId: 1, coordinate: 1, markerTypeId: 1 };
  } else if (markerTypeId == 4) {
    projection = { _id: 1, path: 1, parentId: 1, categoryId: 1 };
  }

  let collection = await db.collection("markers");
  let results = await collection
    .find({ mapSlug: mapSlug, markerTypeId: parseInt(markerTypeId) })
    .project(projection)
    .sort({ lat: -1 })
    .toArray();

  //   results.map(item => {
  //     console.log(item);
  //   });

  res.send(results).status(200);
});

module.exports = router;
