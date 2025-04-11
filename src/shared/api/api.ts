// src/shared/api/api.ts
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/modules/auth/services/firebase';
import { Note } from '@/modules/notes/models/note';
// import { Note } from '../../models/note';

// Add note for a user
export const addNotesForUser = async (userId: string, noteData: Omit<Note, 'id'>) => {
  try {
    const notesCollectionRef = collection(db, 'users', userId, 'notes');
    const docRef = await addDoc(notesCollectionRef, {
      ...noteData,
      createdAt: new Date()
    });
    return {
      data: {
        id: docRef.id,
        ...noteData
      },
      status: 'success'
    };
  } catch (error) {
    console.error("Error adding note:", error);
    throw error;
  }
};

// Get all notes for a user
export const getNotesForUser = async (userId: string) => {
  try {
    const notesCollectionRef = collection(db, 'users', userId, 'notes');
    const querySnapshot = await getDocs(notesCollectionRef);
    
    const notes: Note[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data() as Omit<Note, 'id'>;
      notes.push({
        id: doc.id,
        title: data.title,
        content: data.content,
        category: data.category || 'Uncategorized',
        date: data.date
      });
    });
    
    return notes;
  } catch (error) {
    console.error("Error getting notes:", error);
    throw error;
  }
};

// Update a note
export const updateNoteForUser = async (userId: string, noteId: string, noteData: Partial<Note>) => {
  try {
    const noteDocRef = doc(db, 'users', userId, 'notes', noteId);
    await updateDoc(noteDocRef, {
      ...noteData,
      updatedAt: new Date()
    });
    
    return {
      data: {
        id: noteId,
        ...noteData
      },
      status: 'success'
    };
  } catch (error) {
    console.error("Error updating note:", error);
    throw error;
  }
};

// Delete a note
export const deleteNoteForUser = async (userId: string, noteId: string) => {
  try {
    const noteDocRef = doc(db, 'users', userId, 'notes', noteId);
    await deleteDoc(noteDocRef);
    
    return {
      data: {
        id: noteId
      },
      status: 'success'
    };
  } catch (error) {
    console.error("Error deleting note:", error);
    throw error;
  }
};