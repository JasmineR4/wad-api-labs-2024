import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const TaskSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    deadline: { type: Date, required: true },
    done: { type: Boolean, default: false },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      required: true
    },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
  }
  });

  

  TaskSchema.pre('save', function (next) {
    this.updated_at = Date.now();
    next();
  }
);

  const dateValidator = (date) => {
  return date > new Date();
}
TaskSchema.path("deadline").validate(dateValidator);
export default mongoose.model('Task', TaskSchema); 