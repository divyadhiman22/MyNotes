import React, { useEffect, useState } from "react";
import { useNotesStore } from "../store/notesStore"; 
import NoteForm from "../components/NoteForm";
import SearchBar from "../components/SearchBar";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useAuth } from "../hooks/useAuth";
import Loading from "@/modules/Loader/Loading";
import Alert from "@/shared/components/Alert";
// import Alert from "../components/Alert";

const EditNote: React.FC = () => {
  const { notes, fetchNotes, deleteNote, setSelectedNote, selectedNote, loading } = useNotesStore();
  const { user } = useAuth();
  const [showEditForm, setShowEditForm] = useState(false);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [deleteAlert, setDeleteAlert] = useState<{
    isOpen: boolean;
    noteId: string;
    message: string;
  }>({
    isOpen: false,
    noteId: "",
    message: ""
  });
  
  useEffect(() => {
    if (user?.uid) {
      const fetchData = async () => {
        await fetchNotes(user.uid);
        setIsDataFetched(true);
      };
      
      fetchData();
    }
  }, [fetchNotes, user]);

  useEffect(() => {
    // When a note is selected, show the edit form
    if (selectedNote) {
      setShowEditForm(true);
    }
  }, [selectedNote]);

  const handleEdit = (noteId: string) => {
    const noteToEdit = notes.find(note => note.id === noteId);
    if (noteToEdit) {
      setSelectedNote(noteToEdit);
    }
  };

  const handleDeleteClick = (noteId: string, noteTitle: string) => {
    setDeleteAlert({
      isOpen: true,
      noteId: noteId,
      message: `Are you sure you want to delete "${noteTitle}"?`
    });
  };

  const handleConfirmDelete = async () => {
    if (user?.uid && deleteAlert.noteId) {
      await deleteNote(user.uid, deleteAlert.noteId);
    }
    
    // Close the alert after deletion
    setDeleteAlert({
      isOpen: false,
      noteId: "",
      message: ""
    });
  };

  const handleCancelDelete = () => {
    // Just close the alert without deleting
    setDeleteAlert({
      isOpen: false,
      noteId: "",
      message: ""
    });
  };

  const handleCloseForm = () => {
    setShowEditForm(false);
    setSelectedNote(null);
  };

  // Show loading indicator until data is fetched
  if (loading || !isDataFetched) {
    return <div className="text-center p-4"><Loading /></div>;
  }

  return (
    <div className="h-screen w-full bg-gradient-to-r from-yellow-400 via-white to-yellow-300 flex flex-col">
      <div className="w-full max-w-6xl mx-auto px-4">
        {showEditForm ? (
          <div className="w-full max-w-md mx-auto">
            <NoteForm isEditing={true} onClose={handleCloseForm} />
          </div>
        ) : (
          <div>
            <h2 className="text-xl md:text-2xl font-bold my-4">Edit Notes</h2>
            
            {/* Search Bar Component */}
            <SearchBar />
            
            {notes.length === 0 ? (
              <p className="text-gray-600 text-center my-8">No notes available.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
                {notes.map((note) => (
                  <div 
                    key={note.id} 
                    className="p-4  bg-gradient-to-r from-orange-500 to-red-500 shadow-lg rounded-lg border border-yellow-300"
                  >
                    <div className="flex justify-between items-start">
                      <h2 className="text-lg font-bold text-gray-800 pr-2 break-words">{note.title}</h2>
                      <div className="flex space-x-2 flex-shrink-0">
                        <button 
                          onClick={() => handleEdit(note.id)} 
                          className="text-blue-600 hover:text-blue-800"
                          aria-label="Edit note"
                        >
                          <FiEdit size={18} color="white" />
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(note.id, note.title)} 
                          className="text-red-600 hover:text-red-800"
                          aria-label="Delete note"
                        >
                          <FiTrash2 size={18} color="black"/>
                        </button>
                      </div>
                    </div>
                    <p className="text-white mt-2 break-words">{note.content}</p>
                    <div className="flex flex-col sm:flex-row justify-between mt-4 text-sm text-white">
                      <span className="break-words">Category: {note.category}</span>
                      <span className="mt-1 sm:mt-0">{note.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Delete Confirmation Alert */}
        {deleteAlert.isOpen && (
          <Alert
            type="error"
            message={deleteAlert.message}
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
            confirmText="Delete"
            cancelText="Cancel"
            showCancelButton={true}
          />
        )}
      </div>
    </div>
  );
};

export default EditNote;