import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email address'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  mobile: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        // Allow empty string or valid phone number
        return !v || /^\+?[\d\s-()]{10,}$/.test(v);
      },
      message: 'Please enter a valid mobile number'
    }
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    enum: {
      values: ['Admin', 'Support Admin'],
      message: 'Role must be either Admin or Support Admin'
    }
  },
  address: {
    type: String,
    trim: true,
    maxlength: [500, 'Address cannot be more than 500 characters']
  }
}, {
  timestamps: true // This adds createdAt and updatedAt fields
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    // Hash password with cost of 12
    const hashedPassword = await bcrypt.hash(this.password, 12);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to check password
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Static method to find user by email
UserSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

// Remove password from JSON output
UserSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

// Prevent model re-compilation during development
export default mongoose.models.User || mongoose.model('User', UserSchema);