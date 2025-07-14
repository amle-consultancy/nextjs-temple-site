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

// Index for better search performance - strictly limited to name, deity, city, architecture
placeSchema.index({
  name: "text",
  deity: "text",
  "location.city": "text",
  architecture: "text",
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
placeSchema.statics.searchPlaces = async function (query) {
  // Remove the word "Temple" (case insensitive) from the query
  const cleanedQuery = query.replace(/\btemple\b/gi, '').trim();
  
  // If query is empty after removing "Temple", return all approved places
  if (!cleanedQuery) {
    return this.find({
      isActive: true,
      approvalStatus: 'approved'
    });
  }
  
  // First try to find using MongoDB text search with cleaned query
  const textSearchResults = await this.find({
    $text: { $search: cleanedQuery },
    isActive: true,
    approvalStatus: 'approved'
  }).lean();

  // If we have enough results from text search, return them
  if (textSearchResults.length >= 5) {
    return this.find({
      $text: { $search: cleanedQuery },
      isActive: true,
      approvalStatus: 'approved'
    });
  }
  
  // Otherwise, get all approved places for fuzzy search
  // We'll do the fuzzy search in the API route
  return this.find({
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

// Static method to get temple places with selected fields and dynamic limit
placeSchema.statics.getLimitedTemplePlaces = function (limit) {
  const limits = parseInt(req.query.limit) || 9;
  return this.find({ isActive: true, approvalStatus: 'approved' })
    .select('name deity location builtBy architecture image isActive')
    .limit(limits);
};

const Place = mongoose.models.Place || mongoose.model("Place", placeSchema);

export default Place;
