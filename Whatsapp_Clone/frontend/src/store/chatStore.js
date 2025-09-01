import { create } from 'zustand';
import { getSocket } from '../services/chat.service';
import axiosInstance from '../services/url.service';


export const useChatStore = create((set, get) => ({
    conversations: [],
    currentConversation: null,
    messages: [],
    loading: false,
    error: null,
    onlineUsers: new Map(),
    typingUsers: new Map(),


    //Socket Event Listners setup
    initSocketListners : () =>{
        const socket = getSocket();
        if(!socket) return;

        //remove existing listners to prevent duplicates handlers
        socket.off('receive_message');
        socket.off('user_typing');
        socket.off('user_status');
        socket.off('message_send');
        socket.off('message_error');
        socket.off('message_deleted');

        //Listen for incoming message
        socket.on('receive_message', (message) => {
            set((state) => ({
                messages: [...state.messages, message],
            }));
        });


        //Confirm message delivery
        socket.on('message_send', (message) => {
            set((state) => ({
                messages: state.messages.map((msg) => msg.id === message.id ? { ...msg } : msg)
            }));
        });


        //Update message status
        socket.on('message_status_update', ({ messageId, messageStatus }) => {
            set((state) => ({
                messages: state.messages.map((msg) => msg.id === messageId ? { ...msg,messageStatus } : msg)
            }));
        });

        //Handle reaction on Message
        socket.on('reaction_update', ({ messageId, reaction }) => {
            set((state) => ({
                messages: state.messages.map((msg) => msg.id === messageId ? { ...msg, reaction} : msg)
            }));
        });


        //Handle remove message from local state
        socket.on('message_deleted', (messageId) => {
            set((state) => ({
                messages: state.messages.filter((msg) => msg.id !== messageId)
            }));
        });

        //Handle message editing
        socket.on('message_edited', (updatedMessage) => {
            set((state) => ({
                messages: state.messages.map((msg) => msg.id === updatedMessage.id ? { ...msg, ...updatedMessage } : msg)
            }));
        });


        //Handle any Message  sending error
        socket.on('message_error', (error) => {
            console.error('Message sending error:', error);
        });


        //Listner for typing User
        socket.on('user_typing', ({userId,conversationId,isTyping}) => {
            set((state) => {
                const newTypingUsers = new Map(state.typingUsers);
                if(!newTypingUsers.has(conversationId)) {
                    newTypingUsers.set(conversationId, new Set());
                }

                const typingSet=newTypingUsers.get(conversationId);
                if(isTyping) {
                    typingSet.add(userId);
                } else {
                    typingSet.delete(userId);
                }
                return { typingUsers: newTypingUsers };
            })
        });


        //track User's online/offline Status
        socket.on('user_status', ({ userId, isOnline,lastSeen }) => {
            set((state) => {
                const newOnlineUsers = new Map(state.onlineUsers);
                newOnlineUsers.set(userId, { isOnline, lastSeen });
                return { onlineUsers: newOnlineUsers };
            });
        });


        //Emit Status check for all users in conversation List
        const {conversations}=get();
        if(conversations?.data?.length > 0) {
            conversations.data?.forEach((conversation) => {
                const otherUser=conversation.participants.find((p)=>p._id !==get().currentUser._id);
                if(otherUser._id) {
                    socket.emit('get_user_status',otherUser._id,(status)=>{
                        set((state) => {
                            const newOnlineUsers = new Map(state.onlineUsers);
                            newOnlineUsers.set(state.userId,{
                                isOnline: state.isOnline,
                                lastSeen: state.lastSeen
                            })
                        });
                    });
                }
            });
        }
    },

    setCurrentUser: (user) => {

        set({ currentUser: user });
        console.log("Setting current user:", user);
    },

    fetchConversations: async () => {
        set({ loading: true, error: null });
        try {
            const {data}=await axiosInstance.get("/chats/conversations");
            set({ conversations: data,loading:false });

            get().initSocketListners();
            return data;
        } catch (error) {
            set({ error: error?.response?.data?.message || error?.message,loading: false });
            return null;
        }
    },


    //Fetch Message for a conversation
    fetchMessages: async (conversationId) => {
        if (!conversationId) return;
        set({ loading: true, error: null });
        try {
            const { data } = await axiosInstance.get(`/chats/conversations/${conversationId}/messages`);
            const messageArray=data.data || data || [];

            set({ messages: messageArray,currentConversation:conversationId, loading: false });

            //Mark Unread Message
            const {markMessagesAsRead} = get();
            markMessagesAsRead();
            return messageArray;
        } catch (error) {
            set({ error: error?.response?.data?.message || error?.message, loading: false });
            return [];
        }
    },


    //Send Message in a realtime
    sendMessage:async (formData) => {
        const senderId = formData.get('senderId');
        const receiverId = formData.get('receiverId');
        const content = formData.get('content');
        const media = formData.get('media');
        const messageStatus = formData.get('messageStatus');

        const socket = getSocket();

        const {conversations}=get();
        let conversationId=null;
        if(conversations?.data?.length > 0) {
            const conversation=conversations.data.find((conv) => conv.participants.some((participant) => participant._id === senderId) && conv.participants.some((participant) => participant._id === receiverId));
            if(conversation) {
                conversationId=conversation._id;
                set({ currentConversation: conversationId });
            }
        }

        //Temp Message before actual response
        const tempId=`temp-${Date.now()}`;
        const optimistickMessage={
            _id: tempId,
            sender: { _id: senderId },
            receiver: { _id: receiverId },
            conversation:conversationId,
            imageOrVideoUrl: media && typeof media !== 'string' ? URL.createObjectURL(media) : null,
            content:content,
            contentType: media ? media.type.startsWith('image/') ? 'image' : 'video' : 'text',
            createdAt: new Date().toISOString(),
            messageStatus,
        };

        set((state) => ({
            messages: [...state.messages, optimistickMessage]
        }));

        try {
            const {data} = await axiosInstance.post('/chats/send-message', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const messageData = data.data || data ;

            //Replace optimistic  message with real one
            set((state) => ({
                messages: state.messages.map((msg) => msg._id === tempId ? messageData : msg)
            }));

            return messageData;
        } catch (error) {
            console.error("Failed to send message:", error);
            set((state) => ({
                messages: state.messages.map((msg) => msg._id === tempId ? {...msg, messageStatus:"failed"}:msg),
                error: error?.response?.data?.message || error?.message
            }));
            throw error;
        }
    },


    receiveMessage: (message) => {
       if(!message) return;
       const { currentConversation,currentUser,messages } = get();

       const messageExists=message.some((msg) => msg._id === message._id);
       if(messageExists) return;

       if(message.conversation === currentConversation){
            set((state) => ({
                messages: [...state.messages, message]
            }));
            //automatically mark as read
            if(message.receiver?._id === currentUser?._id) {
                get().markMessagesAsRead();
            }
       }

       //update conversation preview and unreadcount
         set((state) => {
             const updateConversation = state.conversations?.data?.map((conv) => {
                if (conv._id === message.conversation) {
                    return {
                        ...conv,
                        lastMessage: message,
                        unreadCount: message?.receiver?._id === currentUser?._id ? (conv.unreadCount || 0) + 1 : conv.unreadCount || 0,
                    }
                }
                return conv;
             });

             return { conversations: { ...state.conversations, data: updateConversation } };
         });
    },


    // Mark Messages as Read
    markMessagesAsRead: async (messageId) => {
        const {messages,currentUser} = get();

        if(!messages.length || !currentUser) return;

        const unReadsIds=messages.filter((msg) => msg.messageStatus !== 'read' && msg.receiver?._id === currentUser?._id).map((msg) => msg._id).filter(Boolean);

        if(unReadsIds.length === 0) return;

        try {
            const {data}=await axiosInstance.put(`/chats/messages/read`, { messageIds: unReadsIds });

            console.log("Message Mark As Read",data);
            
            set((state)=>({
                messages:state.messages.map((msg) => unReadsIds.includes(msg._id) ? {...msg, messageStatus: 'read'} : msg)
            }));

            const socket=getSocket();
            if(socket) {
                socket.emit("message_read", { messageIds: unReadsIds ,senderId:messages[0]?.sender?._id});
            }
        } catch (error) {
            console.error("Failed to mark messages as read:", error);
        }
    },


    deleteMessage :async (messageId) => {
        try {
            await axiosInstance.delete(`/chats/messages/${messageId}`);

            set((state) => ({
                messages: state.messages.filter((msg) => msg._id !== messageId)
            }));
            return true;
        } catch (error) {
            console.log("Failed to delete message:", error);
            set({error: error?.response?.data?.message || error?.message})
            return false;
        }
    },

    // Add or Change reactions
    addReaction: async (messageId, emoji) => {
        const socket=getSocket();
        const {currentUser}=get();
        if(socket && currentUser){
            socket.emit("add_reaction", { messageId, emoji, userId: currentUser?._id });
        }
    },

    // Update Message
    updateMessage: async (messageId, content) => {
        const {messages} = get();
        const message = messages.find(msg => msg._id === messageId);
        if (!message) return;

        try {
            const {data} = await axiosInstance.put(`/chats/messages/${messageId}`, {content});
            set((state) => ({
                messages: state.messages.map(msg => msg._id === messageId ? {...msg, content: data.content} : msg)
            }));
        } catch (error) {
            console.error("Failed to update message:", error);
        }
    },

    startTyping:(receiverId)=>{
        const {currentConversation}=get();
        const socket=getSocket();
        if(socket && currentConversation && receiverId){
            socket.emit("typing_start", { conversationId: currentConversation,receiverId });
        }
    },

    stopTyping: (receiverId) => {
        const { currentConversation } = get();
        const socket = getSocket();
        if (socket && currentConversation && receiverId) {
            socket.emit("typing_stop", { conversationId: currentConversation, receiverId });
        }
    },


    isUserTyping: (userId) => {
        const { typingUsers, currentConversation } = get();
        if (!currentConversation || !typingUsers.has(currentConversation) || !userId) return false;

        return typingUsers.get(currentConversation)?.has(userId);
    },


    isUserOnline: (userId) => {
        if (!userId) return null;
        const {onlineUsers}=get();
        return onlineUsers.get(userId)?.isOnline || null;
    },


    getUserLastSeen: (userId) => {
        if (!userId) return null;
        const {onlineUsers}=get();
        return onlineUsers.get(userId)?.lastSeen || null;
    },


    cleanup : ()=>{
        set({
            messages: [],
            conversations: [],
            onlineUsers: new Map(),
            typingUsers: new Map(),
            currentConversation: null
        });
    }
}));
