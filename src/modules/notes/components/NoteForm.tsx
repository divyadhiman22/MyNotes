import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNotesStore } from "../store/notesStore";
import { useAuth } from "../hooks/useAuth";
import Alert from "@/shared/components/Alert";

interface NoteInputs {
  title: string;
  content: string;
  category: string;
  date: string;
}

interface NoteFormProps {
  onClose?: () => void;
  isEditing?: boolean;
}

const NoteForm: React.FC<NoteFormProps> = ({ onClose, isEditing = false }) => {
  const { user } = useAuth();
  const { addNote, updateNote, selectedNote, setSelectedNote } = useNotesStore();
  const [alert, setAlert] = useState<{ 
    type: "success" | "error"; 
    message: string; 
  } | null>(null);

  const defaultValues = isEditing && selectedNote
    ? {
        title: selectedNote.title,
        content: selectedNote.content,
        category: selectedNote.category,
        date: selectedNote.date
      }
    : {
        title: "",
        content: "",
        category: "",
        date: new Date().toISOString().split("T")[0]
      };

  const { register, handleSubmit, reset, formState: { errors } } = useForm<NoteInputs>({
    defaultValues
  });

  const onSubmit: SubmitHandler<NoteInputs> = async (data) => {
    if (!user?.uid) {
      setAlert({
        type: "error",
        message: "User not authenticated. Please sign in again."
      });
      return;
    }

    try {
      if (isEditing && selectedNote) {
        await updateNote(user.uid, selectedNote.id, data);
        setAlert({
          type: "success",
          message: "Note updated successfully!"
        });
      } else {
        await addNote(user.uid, data);
        setAlert({
          type: "success",
          message: "Note added successfully!"
        });
      }
      
      // Don't reset form or close until user confirms alert
    } catch (error) {
      console.error("Error saving note:", error);
      setAlert({
        type: "error",
        message: "Failed to save note. Please try again."
      });
    }
  };

  const handleAlertConfirm = () => {
    if (alert?.type === "success") {
      reset();
      setSelectedNote(null);
      if (onClose) onClose();
    }
    setAlert(null);
  };

  const handleCancel = () => {
    setSelectedNote(null);
    if (onClose) onClose();
  };

  return (
    <div className="mt-[10%] w-full max-w-md mx-auto p-4 sm:p-6  bg-gradient-to-r from-orange-500 to-red-500 shadow-lg rounded-lg border border-yellow-300">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        {isEditing ? "Edit Note" : "Add a Note"}
      </h2>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onConfirm={handleAlertConfirm}
          confirmText="OK"
        />
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Title"
            {...register("title", { required: "Title is required" })}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500"
          />
          {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
        </div>

        <div>
          <textarea
            placeholder="Content"
            {...register("content", { required: "Content is required" })}
            rows={3}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500"
          />
          {errors.content && <p className="text-red-500 text-sm">{errors.content.message}</p>}
        </div>

        <div>
          <input
            type="text"
            placeholder="Category"
            {...register("category", { required: "Category is required" })}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500"
          />
          {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
        </div>

        <div>
          <input
            type="date"
            {...register("date", { required: "Date is required" })}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500"
          />
          {errors.date && <p className="text-red-500 text-sm">{errors.date.message}</p>}
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-2">
          <button
            type="button"
            onClick={handleCancel}
            className="bg-gray-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-yellow-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-yellow-600 transition"
          >
            {isEditing ? "Update Note" : "Add Note"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NoteForm;