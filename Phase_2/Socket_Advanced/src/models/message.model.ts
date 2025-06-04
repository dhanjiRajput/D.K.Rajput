import mongoose, { Schema, Document } from 'mongoose';

interface IMessage extends Document {
  sender: string;
  receiver: string;
  content: string;
  timestamp: Date;
}

const MessageSchema: Schema = new Schema({
  sender: String,
  receiver: String,
  content: String,
  timestamp: { type: Date, default: Date.now },
});

const Message=mongoose.model<IMessage>('Message', MessageSchema);
export default Message;