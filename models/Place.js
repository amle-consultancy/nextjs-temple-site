import mongoose from "mongoose";

const festivalSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  period: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    maxlength: 200,
  },
});

const locationSchema = new mongoose.Schema({
  city: {
    type: String,
    trim: true,
  },
  district: {
    type: String,
    trim: true,
  },
  state: {
    type: String,
    trim: true,
  },
  pincode: {
    type: String,
    trim: true,
    match: [/^\d{6}$/, "Pincode must be exactly 6 digits"],
  },
});

const contactSchema = new mongoose.Schema({
  phone: {
    type: String,
    trim: true,
  },
  website: {
    type: String,
    trim: true,
  },
});

const placeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    deity: {
      type: String,
      trim: true,
    },
    location: {
      type: locationSchema,
    },
    architecture: {
      type: String,
      trim: true,
    },
    about: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    builtBy: {
      type: String,
      trim: true,
    },
    constructionPeriod: {
      type: String,
      trim: true,
    },
    significance: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    contact: contactSchema,
    mapsLink: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      trim: true,
    },
    festivals: [festivalSchema],
    isActive: {
      type: Boolean,
      default: true,
    },
    approvalStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    approvedAt: {
      type: Date
    },
    rejectionReason: {
      type: String,
      trim: true
    },
  },
  {
    timestamps: true,
  }
);

// Index for better search performance
placeSchema.index({
  name: "text",
  "location.city": "text",
  "location.state": "text",
});
placeSchema.index({ "location.state": 1, "location.city": 1 });
placeSchema.index({ deity: 1 });
placeSchema.index({ architecture: 1 });
placeSchema.statics.findByLocation = function (state, city) {
  return this.find({
    "location.state": state,
    ...(city && { "location.city": city }),
    isActive: true,
    approvalStatus: 'approved'
  });
};

// Static method to find by deity
placeSchema.statics.findByDeity = function (deity) {
  return this.find({ deity, isActive: true, approvalStatus: 'approved' });
};

// Static method to search places
placeSchema.statics.searchPlaces = function (query) {
  return this.find({
    $text: { $search: query },
    isActive: true,
    approvalStatus: 'approved'
  });
};

// Static method to find pending places for approval
placeSchema.statics.findPendingApproval = function () {
  return this.find({
    approvalStatus: 'pending',
    isActive: true
  }).populate('createdBy', 'name email role');
};

// Static method to find places by approval status
placeSchema.statics.findByApprovalStatus = function (status) {
  return this.find({
    approvalStatus: status,
    isActive: true
  }).populate('createdBy', 'name email role').populate('approvedBy', 'name email role');
};

const Place = mongoose.models.Place || mongoose.model("Place", placeSchema);

export default Place;
