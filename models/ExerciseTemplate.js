import mongoose from "mongoose";

const ExerciseTemplateSchema = new mongoose.Schema({
  name: String,
  sets: Number,
  reps: Number,
});

export default mongoose.models.ExerciseTemplate || mongoose.model("ExerciseTemplate", ExerciseTemplateSchema);
