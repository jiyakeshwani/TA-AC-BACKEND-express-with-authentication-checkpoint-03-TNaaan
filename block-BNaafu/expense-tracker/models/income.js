var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var incomeSchema = new Schema(
  {
    source: String,
    amount: Number,
    date: Number,
    userId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Income", incomeSchema);
