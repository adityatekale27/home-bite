import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true, maxLength: 50 },
    lastName: { type: String, required: true, trim: true, maxLength: 50 },
    email: { type: String, required: true, trim: true, unique: true, lowercase: true },
    phoneNumber: { type: String, required: true, trim: true },
    password: { type: String, required: true, trim: true, minLength: 8, select: false },
    role: { type: String, enum: ["customer", "chef", "rider", "admin"], default: "customer" },
    profileImage: { type: String, default: null },
    isAccountActive: { type: Boolean, default: true },
    isEmailVerified: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for faster query
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ phoneNumber: 1 });
userSchema.index({ role: 1 });
userSchema.index({ defaultLocation: "2dsphere" });
userSchema.index({ isAccountActive: 1 });
userSchema.index({ isEmailVerified: 1 });

// Virtuals for full name
userSchema.virtual("fullName").get(() => {
  return `${this.firstName} ${this.lastName}`;
});

const User = mongoose.model("User", userSchema);
export default User;
