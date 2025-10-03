import mongoose from "mongoose";

const ExerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sets: { type: Number, required: true },
  reps: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

export default mongoose.models.Exercise || mongoose.model("Exercise", ExerciseSchema);
