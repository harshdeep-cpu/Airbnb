const mongoose = require('mongoose');
const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  home: { type: mongoose.Schema.Types.ObjectId, ref: 'Home' },
  guestName: String,
  guestMail: String,
  guestNo: String,
  checkinDate: Date,
  checkoutDate: Date,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Booking", bookingSchema);