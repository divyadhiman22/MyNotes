import React from "react";
import NoteForm from "../components/NoteForm";

const AddNote: React.FC = () => {
  return (
    <div className="h-screen w-full bg-gradient-to-r from-yellow-400 via-white to-yellow-300 flex flex-col">
      <div className="w-[90%] max-w-md mx-auto">
        <NoteForm />
      </div>
    </div>
  );
};

export default AddNote;