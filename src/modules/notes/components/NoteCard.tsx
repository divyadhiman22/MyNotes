import React from "react";

interface NoteCardProps {
  title: string;
  content: string;
  date: string;
}

const NoteCard: React.FC<NoteCardProps> = ({ title, content, date }) => {
  // Truncate content if it exceeds a certain length
  const truncatedContent = content.length > 100 
    ? `${content.substring(0, 100)}...` 
    : content;

  return (
    <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2">
      <div className="h-full p-4  bg-gradient-to-r from-orange-500 to-red-500 shadow-lg rounded-lg border border-yellow-300">
        <h2 className="text-lg font-bold text-white break-words">{title}</h2>
        <p className="text-white mt-2 break-words">{truncatedContent}</p>
        <div className="mt-4 text-right text-sm text-gray-200">{date}</div>
      </div>
    </div>
  );
};

export default NoteCard;