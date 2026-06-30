const router = require("express").Router();

const Message = require("../models/Message");

// receive contact form messages

router.post("/", async (req, res) => {
  try {
    const newMessage = new Message({
      name: req.body.name,

      email: req.body.email,

      message: req.body.message,
    });

    await newMessage.save();

    res.json({
      success: true,

      message: "Message received successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
});

module.exports = router;
