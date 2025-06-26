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
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    reviews: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
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
  });
};

// Static method to find by deity
placeSchema.statics.findByDeity = function (deity) {
  return this.find({ deity, isActive: true });
};

// Static method to search places
placeSchema.statics.searchPlaces = function (query) {
  return this.find({
    $text: { $search: query },
    isActive: true,
  });
};

const Place = mongoose.models.Place || mongoose.model("Place", placeSchema);

export default Place;
