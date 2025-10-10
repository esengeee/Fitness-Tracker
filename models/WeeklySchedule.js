import mongoose from "mongoose";

const WeeklyScheduleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // reference to the user
    ref: "User",
    required: true,
  },
  day: {
    type: String,
    enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    required: true,
  },
  exercises: [
    {
      name: { type: String, required: true },
      sets: { type: Number, required: true },
      reps: { type: Number, required: true },
    },
  ],
});

export default mongoose.models.WeeklySchedule || mongoose.model("WeeklySchedule", WeeklyScheduleSchema);
