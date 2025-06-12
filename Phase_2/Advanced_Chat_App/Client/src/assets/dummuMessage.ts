// src/data/dummyMessages.ts

export interface ChatMessage {
  id: string;
  senderId: string;
  senderImage: string;
  text: string;
  timestamp: string;
}

export const dummyMessages: ChatMessage[] = [
  {
    id: "m1",
    senderId: "u1",
    senderImage: "",
    text: "Hey there! How's it going?",
    timestamp: "2025-06-11T10:30:00Z",
  },
  {
    id: "m2",
    senderId: "u2",
    senderImage: "",
    text: "All good here. Just working on the project. You?",
    timestamp: "2025-06-11T10:32:00Z",
  },
  {
    id: "m3",
    senderId: "u1",
    senderImage: "",
    text: "Same here. Pushing the chat module now.",
    timestamp: "2025-06-11T10:34:00Z",
  },
  {
    id: "m4",
    senderId: "u3",
    senderImage: "https://randomuser.me/api/portraits/men/3.jpg",
    text: "Nice! Let me know if you want a quick review.",
    timestamp: "2025-06-11T10:36:00Z",
  },
  {
    id: "m5",
    senderId: "u2",
    senderImage: "https://randomuser.me/api/portraits/women/2.jpg",
    text: "Sure, I’ll ping you in 10 minutes.",
    timestamp: "2025-06-11T10:37:00Z",
  },
];
