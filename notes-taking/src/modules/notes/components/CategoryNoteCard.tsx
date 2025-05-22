import React from "react";

interface CategoryNoteCardProps {
  name: string;
  count: number;
}

const CategoryNoteCard: React.FC<CategoryNoteCardProps> = ({ name, count }) => {
  return (
    <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2">
      <div className="h-full p-4  bg-gradient-to-r from-orange-500 to-red-500 shadow-lg rounded-lg border border-yellow-300 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800 break-words mr-2">{name}</h2>
        <span className="bg-black text-white px-3 py-1 rounded-full text-sm font-bold flex-shrink-0">
          {count < 10 ? `0${count}` : count}
        </span>
      </div>
    </div>
  );
};

export default CategoryNoteCard;