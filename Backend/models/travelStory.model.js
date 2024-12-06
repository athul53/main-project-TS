const mongoose = require("mongoose"); // Fixed the typo
const Schema = mongoose.Schema; // Fixed the typo

const travelStorySchema = new Schema({ // Changed to travelStorySchema for consistency
    title: { type: String, required: true },
    story: { type: String, required: true },
    visitedLocation: { type: [String], default: [] },
    isFavourite: { type: Boolean, default: false },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Ensure ref matches the model name
    createdOn: { type: Date, default: Date.now },
    imageUrl: { type: String, required: true },
    visitedDate: { type: Date, required: true },
});

module.exports = mongoose.model("TravelStory", travelStorySchema); // Ensure variable name matches
