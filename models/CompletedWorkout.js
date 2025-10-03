import mongoose from "mongoose";

const CompletedWorkoutSchema = new mongoose.Schema({
  userId: String,
  date: { type: Date, default: Date.now },
  exercises: [
    {
      name: String,
      sets: Number,
      reps: Number,
    }
  ]
});

export default mongoose.models.CompletedWorkout || mongoose.model("CompletedWorkout", CompletedWorkoutSchema);
