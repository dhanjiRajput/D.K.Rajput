// src/data/dummyUsers.ts

export interface UserProfile {
  id: string;
  fullName: string;
  username: string;
  email: string;
  avatar: string;
  bio: string;
}

export const dummyUsers: UserProfile[] = [
  {
    id: "u1",
    fullName: "Aarav Mehta",
    username: "aarav_mehta",
    email: "aarav@example.com",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    bio: "Frontend Developer from Mumbai 🚀",
  },
  {
    id: "u2",
    fullName: "Sanya Verma",
    username: "sanya.verma",
    email: "sanya@example.com",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    bio: "UX Designer | Coffee Addict ☕",
  },
  {
    id: "u3",
    fullName: "Ritik Sharma",
    username: "ritiksh",
    email: "ritik@example.com",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    bio: "Backend Engineer | Node.js & MongoDB",
  },
  {
    id: "u4",
    fullName: "Isha Patel",
    username: "isha_p",
    email: "isha@example.com",
    avatar: "https://randomuser.me/api/portraits/women/4.jpg",
    bio: "Full Stack Developer 💻",
  },
  {
    id: "u5",
    fullName: "Kabir Sen",
    username: "kabirsen",
    email: "kabir@example.com",
    avatar: "https://randomuser.me/api/portraits/men/5.jpg",
    bio: "React Native Enthusiast 📱",
  },
];
