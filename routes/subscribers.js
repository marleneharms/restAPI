const express = require("express");
const router = express.Router();
const Subscriber = require("../models/subscriber");

// Getting all
router.get("/", async (req, res) => {
  try {
    const subscribers = await Subscriber.find();
    res.json(subscribers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Getting one
router.get("/:id", getSubscriber, (req, res) => {
  res.json(res.subscriber);
});

// Creating one
router.post("/", async (req, res) => {
  const subscriber = new Subscriber({
    name: req.body.name,
    subscribedToChannel: req.body.subscribedToChannel,
  });

  try {
    const newSubscriber = await subscriber.save();
    res.status(201).json(newSubscriber);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Updating one
router.patch("/:id", getSubscriber, async (req, res) => {
  if (req.body.name) {
    res.subscriber.name = req.body.name;
  }
  if (req.body.subscribedToChannel) {
    res.subscriber.subscribedToChannel = req.body.subscribedToChannel;
  }
  console.log(res.subscriber._id.valueOf());
  try {
    const subscriber = await Subscriber.findByIdAndUpdate(
      res.subscriber._id.valueOf(),
      res.subscriber
    );
    res.json(subscriber);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}); // only want to update on what subscribers send

// Deleting one
router.delete("/:id", async (req, res) => {
  try {
    const subscriber = await Subscriber.findByIdAndDelete(req.params.id);
    res.json({ message: `Deleted Subscriber ${subscriber}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getSubscriber(req, res, next) {
  let subscriber;
  try {
    subscriber = await Subscriber.findById(req.params.id);
    if (!subscriber) {
      return res.status(404).json({ message: "Cannot Find subscriber" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.subscriber = subscriber;
  next();
}

module.exports = router;
