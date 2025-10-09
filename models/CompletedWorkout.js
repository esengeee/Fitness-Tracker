import mongoose from "mongoose";

const completedWorkoutSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: String, required: true },
  exercises: [
    {
      name: String,
      sets: Number,
      reps: Number,
    },
  ],
});

export default mongoose.models.CompletedWorkout || mongoose.model("CompletedWorkout", completedWorkoutSchema);
