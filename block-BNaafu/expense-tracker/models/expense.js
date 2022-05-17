var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var expenseSchema = new Schema(
  {
    category: String,
    amount: Number,
    date: Number,
    userId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Expense", expenseSchema);
