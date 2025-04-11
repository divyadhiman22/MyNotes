import { useEffect, useState } from "react";
import NoteCard from "../components/NoteCard";
import { useNotesStore } from "../store/notesStore";
import SearchBar from "../components/SearchBar";
import { useAuth } from "../hooks/useAuth";
import Loading from "@/modules/Loader/Loading";

const ViewNote: React.FC = () => {
  const { notes, fetchNotes, loading: notesLoading } = useNotesStore();
  const { user, loading: authLoading } = useAuth(); // Make sure your useAuth hook exports a loading state
  const [isDataFetched, setIsDataFetched] = useState(false);
  
  useEffect(() => {
    // Only fetch notes if user is authenticated and notes haven't been fetched yet
    if (user?.uid && !isDataFetched) {
      const fetchData = async () => {
        await fetchNotes(user.uid);
        setIsDataFetched(true);
      };
      
      fetchData();
    }
  }, [fetchNotes, user, isDataFetched]);

  // Show loading indicator if auth is still loading or notes are loading
  if (authLoading || notesLoading || (!isDataFetched && user)) {
    return (
      <div className="text-center p-8 mt-8">
        <Loading />
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-gradient-to-r from-yellow-400 via-white to-yellow-300 flex flex-col">
      <div className="w-[90%] mx-auto">
      <h2 className="text-2xl font-bold my-4">ALL NOTES</h2>
        <SearchBar />
        
        <div className="flex flex-wrap justify-center items-center">
          {notes.length === 0 ? (
            <p className="text-gray-600 text-center w-full my-8">No notes available.</p>
          ) : (
            notes.map((note) => (
              <NoteCard 
                key={note.id} 
                title={note.title} 
                content={note.content} 
                date={note.date || "No date"} 
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewNote;