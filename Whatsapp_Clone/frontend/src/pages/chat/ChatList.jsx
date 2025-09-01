import React, { useState } from 'react'
import useLayoutStore from '../../store/layoutStore';
import useThemeStore from '../../store/themeStore';
import userUserStore from '../../store/useUserStore';
import { FaPlus, FaSearch } from 'react-icons/fa';
import { motion } from 'framer-motion';
import formatTimestamp from '../../utils/FromateTimer';

const ChatList = ({ contacts }) => {
    const setSelectedContact = useLayoutStore(state => state.setSelectedContact);
    const selectedContact = useLayoutStore(state => state.selectedContact);
    const { theme } = useThemeStore();
    const { user } = userUserStore();

    const [searchTerm, setSearchTerm] = useState('');

    const filteredContacts = contacts?.filter(contact => contact?.username?.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className={`w-full border-r h-screen 
        ${theme === 'dark' ? 'bg-[rgb(17,27,33)] border-gray-600' : 'bg-white border-gray-200'}`}>
            <div className={`p-4 flex justify-between ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                <h2 className='text-xl font-semibold'>
                    Chats
                </h2>
                <button className='p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors cursor-pointer'>
                    <FaPlus />
                </button>
            </div>

            <div className='p-2'>
                <div className='relative'>
                    <FaSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-800'}`} />
                    <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search or start a new chat"
                        className={`w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500
                    ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-gray-100 border-gray-300 text-black placeholder-gray-400'}`} />
                </div>
            </div>

            <div className='overflow-y-auto h-[calc(100vh-120px)]'>
                {
                    filteredContacts.map((contact) => (
                        <motion.div key={contact._id}
                            onClick={() => setSelectedContact(contact)}
                            className={`p-3 flex items-center cursor-pointer ${
                                theme === 'dark' 
                                    ? selectedContact?._id === contact?._id 
                                        ? 'bg-gray-700' 
                                        : 'hover:bg-gray-800' 
                                    : selectedContact?._id === contact?._id 
                                        ? 'bg-gray-200' 
                                        : 'hover:bg-gray-100'}`}>
                            <img src={contact?.profilePicture || 'https://cdn-icons-png.flaticon.com/512/6596/6596121.png'} alt={contact?.username} className='w-12 h-12 rounded-full' />
                            <div className='ml-3 flex-1'>
                                <div className='flex justify-between items-baseline'>
                                    <h2 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                                        {contact.username}
                                    </h2>
                                    {contact?.conversation && (
                                        <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                            {formatTimestamp(contact?.conversation?.lastMessage?.createdAt)}
                                        </span>
                                    )}
                                </div>
                                <div className='flex justify-between items-baseline'>
                                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} truncate`}>
                                        {contact?.conversation?.lastMessage?.content}
                                    </p>
                                    {contact?.conversation && contact?.conversation?.unReadCount > 0 && (
                                        
                                        <p className={`text-sm font-semibold w-5 h-5 flex items-center justify-center bg-yellow-500 
                                        ${theme === 'dark' ? 'text-gray-800' : 'text-gray-500'} rounded-full`}>
                                            {contact?.conversation?.unReadCount}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))
                }
            </div>
        </div>
    )
}

export default ChatList