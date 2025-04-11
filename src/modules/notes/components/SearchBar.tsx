import React, { useState } from "react";
import { useNotesStore } from "../store/notesStore";
import { useAuth } from "../hooks/useAuth";
// import { useAuth } from "@/modules/auth/hooks/useAuth";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { searchNotes } = useNotesStore();
  const { user } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (user?.uid) {
      searchNotes(user.uid, searchQuery);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto my-4">
      <form onSubmit={handleSearch} className="flex">
        <input
          type="text"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-grow p-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-yellow-500 focus:outline-none"
        />
        <button
          type="submit"
          className="bg-yellow-500 text-white px-4 py-2 rounded-r-md hover:bg-yellow-600 transition"
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchBar;