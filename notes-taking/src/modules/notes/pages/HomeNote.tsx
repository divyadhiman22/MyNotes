import { useEffect, useState } from "react";
import CategoryNoteCard from "../components/CategoryNoteCard";
import { useNotesStore } from "../store/notesStore";
import { useAuth } from "../hooks/useAuth";
import Loading from "@/modules/Loader/Loading";

const HomeNote: React.FC = () => {
  const { categories, fetchNotes, loading } = useNotesStore();
  const { user } = useAuth();
  const [isDataFetched, setIsDataFetched] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      const fetchData = async () => {
        await fetchNotes(user.uid);
        setIsDataFetched(true);
      };
      
      fetchData();
    }
  }, [fetchNotes, user]);

  // Show loading indicator until data is fetched
  if (loading || !isDataFetched) {
    return <div className="text-center p-4"><Loading /></div>;
  }

  return (
    <div className=" h-screen w-full bg-gradient-to-r from-yellow-400 via-white to-yellow-300 flex flex-col">
      <div className="w-[90%] mx-auto">
        <h2 className="text-2xl font-bold my-4">TOTAL NOTES</h2>
        
       
        
        {categories.length === 0 ? (
          <p className="text-gray-600 text-center">No notes available.</p>
        ) : (
          <div className="flex flex-wrap justify-center">
            {categories.map((category, index) => (
              <CategoryNoteCard key={index} name={category.name} count={category.count} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeNote;