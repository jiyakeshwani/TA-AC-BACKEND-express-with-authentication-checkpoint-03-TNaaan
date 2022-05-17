var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bcrypt = require("bcrypt");

var userSchema = new Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: { type: String, required: true },
    age: Number,
    phone: Number,
    country: String,
    expenseId: [{ type: Schema.Types.ObjectId, ref: "Expense" }],
    incomeId: [{ type: Schema.Types.ObjectId, ref: "Income" }],
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  if (this.password && this.isModified("password")) {
    bcrypt.hash(this.password, 10, (err, hashed) => {
      if (err) return next(err);
      this.password = hashed;
      return next();
    });
  } else {
    next();
  }
});

userSchema.methods.verifyPassword = function (password, cb) {
  bcrypt.compare(password, this.password, (err, result) => {
    return cb(err, result);
  });
};

module.exports = mongoose.model("User", userSchema);
