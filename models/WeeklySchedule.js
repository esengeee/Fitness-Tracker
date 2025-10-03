import mongoose from "mongoose";

const WeeklyScheduleSchema = new mongoose.Schema({
  userId: String, 
  day: { type: String, enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] },
  exercises: [
    {
      name: String,
      sets: Number,
      reps: Number,
    }
  ]
});

export default mongoose.models.WeeklySchedule || mongoose.model("WeeklySchedule", WeeklyScheduleSchema);
