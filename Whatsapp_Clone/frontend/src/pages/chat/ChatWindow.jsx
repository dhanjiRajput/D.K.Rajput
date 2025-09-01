import  React, { useEffect } from 'react'
import { useState, useRef } from 'react';
import useThemeStore from '../../store/themeStore';
import userUserStore from '../../store/useUserStore';
import { useChatStore } from '../../store/chatStore';
import { format, isToday, isYesterday } from 'date-fns';
import whatsappImage from '../../images/whatsapp_image.png';
import { FaArrowLeft, FaEllipsisV, FaLock, FaPaperclip, FaSmile, FaTimes, FaVideo } from 'react-icons/fa';
import MessageBubble from './MessageBubble';
import Picker from 'emoji-picker-react';


const isValidate = (date) => {
  return date instanceof Date && !isNaN(date);
}

const ChatWindow = ({selectedContact,setSelectedContact,isMobile}) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showFileMenu, setShowFileMenu] = useState(false);
  const [filePreview, setFilePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const typingTimeoutRef = useRef(null);
  const messageEndRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const fileInputRef = useRef(null);

  const { theme } = useThemeStore();
  const { user } = userUserStore();
  const { messages, 
    sendMessage, 
    loading, 
    receiveMessage, 
    fetchMessages, 
    fetchConversations, 
    conversations, 
    isUserTyping, 
    startTyping, 
    stopTyping, 
    getUserLastSeen, 
    isUserOnline, 
    cleanup,
    deleteMessage,
    updateMessage,
    addReaction,
  } = useChatStore();

  //get online status and lastseen
  const online=isUserOnline(selectedContact?._id);
  const lastSeen=getUserLastSeen(selectedContact?._id);
  const isTyping=isUserTyping(selectedContact?._id);


  useEffect(() => {
    if (selectedContact?._id && conversations?.data?.length > 0) {
      const conversation = conversations.data.find((conv) => conv.participants.some((participant)=>participant._id === selectedContact?._id));
      if (conversation) {
        fetchMessages(conversation._id);
      }
    }
  }, [selectedContact, conversations]);

  useEffect(() => {
    fetchConversations();
  }, []);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'auto' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(()=>{
    if(message && selectedContact){
      startTyping(selectedContact._id);

      if(typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        stopTyping(selectedContact._id);
      }, 2000);
    }

    return () => {
      if(typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  }, [message, selectedContact,startTyping, stopTyping]);


  const handleFileChange=(e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setShowFileMenu(false);
      if(file.type.startsWith('image/')){
        setFilePreview(URL.createObjectURL(file));
      }
    }
  };


  const handleSendMessage=async () => {
    if(!selectedContact) return;
    setFilePreview(null);

    try {
      const formData=new FormData();
      formData.append('senderId',user?._id);
      formData.append('receiverId',selectedContact?._id);
      
      const status=online ? 'delivered' : 'send';
      formData.append('messageStatus', status);

      if(message.trim()){
        formData.append('content', message.trim());
      }

      //If there is a file include that too
      if(selectedFile){
        formData.append('media',selectedFile,selectedFile.name);
      }

      if(!message.trim() && !selectedFile) return;
      await sendMessage(formData);

      //clear state
      setMessage('');
      setSelectedFile(null);
      setFilePreview(null);
      setShowFileMenu(false);

    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const renderDataSeparator=(date)=>{
    if(!isValidate(date)) return null;

    let dateString;
    if(isToday(date)){
      dateString='Today';
    } else if(isYesterday(date)){
      dateString='Yesterday';
    } else {
      dateString=format(date, 'EEEE, MMMM d');
    }

    return (
      <div className="flex justify-center my-4">
        <span className={`px-4 py-2 rounded-full text-sm 
          ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'}`}>
          {dateString}
        </span>
      </div>
    );
  };

  //Group Message 
  const groupMessages=Array.isArray(messages) ? messages.reduce((acc, message) => {
    if (!message.createdAt) return acc;
    const date = new Date(message.createdAt);

    if(isValidate(date)){
      const dateString=format(date, 'yyyy-MM-dd');
      if(!acc[dateString]){
        acc[dateString]=[];
      }
      acc[dateString].push(message);
    }else{
      console.error('Invalid message date:', message);
    }
    return acc;
  }, {}) : {};

  const handleReaction = (messageId, emoji) => {
    addReaction(messageId, emoji);
  };

  if(!selectedContact){
    return (
      <div className="flex flex-1 flex-col items-center justify-center h-screen mx-auto text-center">
        <div className='max-w-md'>
          <img src={whatsappImage} alt="WhatsApp" className="w-full h-auto"/>
          <h2 className={`text-3xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
            Select a conversation to start chatting
          </h2>
          <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
            Choose a Contact from the List
          </p>
          <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mt-8 text-sm flex items-center justify-center gap-2`}>
            <FaLock className='h-4 w-4'/>
            Personal messages are end-to-end encrypted.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className='flex-1 h-screen w-full flex flex-col'>
      <div className={`p-4 ${theme === 'dark' ? 'bg-[#303430] text-white' : 'bg-[rgb(239,242,245)] text-gray-600 '}flex items-center`}>
          <button className='mr-2 focus:outline-none cursor-pointer'
          onClick={()=>setSelectedContact(null)}>
            <FaArrowLeft className='h-6 w-6'/>
          </button>
          <img src={selectedContact?.profilePicture || 'https://cdn-icons-png.flaticon.com/512/6596/6596121.png'} alt={selectedContact?.username} 
          className="h-10 w-10 rounded-full" />

          <div className='ml-3 flex-grow'>
            <h2 className={`text-start font-semibold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
              {selectedContact?.username}
            </h2>
            {
              isTyping ? (
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  typing...
                </p>
              ) : (
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  {online ? 'Online' : lastSeen ? `Last seen: ${format(new Date(lastSeen), 'HH:mm')}` : 'Offline'}
                </p>
              )
            }
          </div>

          <div className='flex items-center space-x-4'>
            <button className='focus:outline-none cursor-pointer'>
              <FaVideo className='h-5 w-5'/>
            </button>
            <button className='focus:outline-none cursor-pointer'>
              <FaEllipsisV className='h-5 w-5'/>
            </button>
          </div>
      </div>

      <div className={`flex-1 p-4 overflow-y-auto 
        ${theme === 'dark' ? 'bg-[#191a1a]' : 'bg-[rgb(241,236,229)] text-gray-600'}`}>
          {
            Object.entries(groupMessages).map(([date, msgs]) => (
              <React.Fragment key={date}>
                {renderDataSeparator(new Date(date))}
                {
                  msgs.filter((msg)=>msg.conversation === selectedContact?.conversation?._id).map((msg) => (
                    <MessageBubble key={msg._id} message={msg} theme={theme} currentUser={user} onReact={handleReaction} deleteMessage={deleteMessage} />
                  ))
                }
              </React.Fragment>
            ))
          }
          <div ref={messageEndRef}/>
      </div>
      {
        filePreview && (
          <div className='relative p-2'>
              <img src={filePreview} alt="Preview" className='w-80 object-cover shadow-lg mx-auto rounded' />
              <button onClick={() => {
                setFilePreview(null);
                setSelectedFile(null);
              }} className='absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1'>
                <FaTimes className='h-4 w-4'/>
              </button>
          </div>
        )
      }

      <div className={`p-4 ${theme === 'dark' ? 'bg-[#303430]' : 'bg-white'} flex items-center space-x-2 relative`}>
         <button className='focus:outline-none cursor-pointer' onClick={()=>setShowEmojiPicker(!showEmojiPicker)}>
          <FaSmile className={`h-6 w-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}/>
         </button>
         {
          showEmojiPicker && (
            <div ref={emojiPickerRef} className='absolute bottom-16 left-0 z-50'>
              <Picker onEmojiClick={(emojiObject)=>{
                setMessage((prev) => prev + emojiObject.emoji);
                setShowEmojiPicker(false);
              }} theme={theme}/>
            </div>
          )
         }

         <div className='relative'>
            <button className='focus:outline-none cursor-pointer' onClick={()=>setShowFileMenu(!showFileMenu)}>
              <FaPaperclip className={`h-6 w-6 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mt-2 ml-1`}/>
            </button>
            {
              showFileMenu && (
                <div className={`absolute bottom-full left-0 mb-2 
                ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} rounded-lg shadow-lg`}>
                  <FilePicker onFileSelect={(file) => {
                    setSelectedFile(file);
                    setShowFileMenu(false);
                  }} />
                </div>
              )
            }
         </div>
      </div>
    </div>
  )
}

export default ChatWindow