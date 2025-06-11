import { BsCheck2All } from "react-icons/bs";
import type { MessageCompProps } from "../../interface";
import { GetUserIcon } from "../../helper";

const formatTime = (date: Date) =>
  new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

const MessageComp = ({ user, message, timestamp, socket }: MessageCompProps) => {
  const isCurrentUser = user.id === socket.id;

  return (
    <div className={`flex w-full mb-3 ${isCurrentUser ? "justify-end" : "justify-start"}`}>
      {!isCurrentUser && (
        <div className="mr-2">
          <GetUserIcon name={user.username} size={8} />
        </div>
      )}

      <div className={`flex flex-col items-${isCurrentUser ? "end" : "start"} max-w-[75%]`}>
        {/* Username and timestamp */}
        <div className="mb-1">
          <span className="text-xs font-medium text-gray-500">
            {user.username}
            {isCurrentUser}
          </span>
          <span className="text-xs text-gray-400 ml-2">
            {formatTime(timestamp)}
          </span>
        </div>

        {/* Message Bubble */}
        <div
          className={`rounded-xl p-3 shadow-sm break-words ${
            isCurrentUser
              ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-none"
              : "bg-white border border-slate-200 text-black rounded-bl-none"
          }`}
        >
          <p className="text-sm">{message}</p>
          {isCurrentUser && (
            <div className="flex justify-end mt-1">
              <BsCheck2All className="h-3 w-3 text-blue-200" />
            </div>
          )}
        </div>
      </div>

      {isCurrentUser && (
        <div className="ml-2">
          <GetUserIcon name={user.username} size={8} />
        </div>
      )}
    </div>
  );
};

export default MessageComp;
