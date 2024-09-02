const Marker = require("../models/marker-model");

const getMarkersByArea = async (req, res) => {
  console.log(req.params);
  await Marker.find({ mapSlug: req.params.mapSlug })
    .sort({ lat: 1 })

    .then((markers, err) => {
      if (err) {
        return res.status(400).json({ success: false, error: err });
      }

      return res.status(200).json({ success: true, data: markers });
    })
    .catch((err) => console.log(err));
};

const getMarkersByAreaAndType = async (req, res) => {
  console.log(req.params, "type");
  await Marker.find({
    $and: [
      { mapSlug: req.params.mapSlug },
      { markerTypeId: req.params.markerTypeId }
    ],
  })
    .sort({ lat: 1 })

    .then((markers, err) => {
      if (err) {
        return res.status(400).json({ success: false, error: err });
      }

      return res.status(200).json({ success: true, data: markers });
    })
    .catch((err) => console.log(err));
};

module.exports = {
  getMarkersByArea,
  getMarkersByAreaAndType,
};
