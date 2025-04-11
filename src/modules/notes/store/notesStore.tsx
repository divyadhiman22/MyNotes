import { create } from 'zustand';
import { 
  collection, 
  getDocs, 
  query, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc
} from 'firebase/firestore';
import { Note } from '../models/note';
import { db } from '@/modules/auth/services/firebase';

interface NotesState {
  notes: Note[];
  categories: { name: string; count: number }[];
  loading: boolean;
  selectedNote: Note | null;
  
  // Actions
  fetchNotes: (userId: string) => Promise<void>;
  addNote: (userId: string, note: Omit<Note, 'id'>) => Promise<void>;
  updateNote: (userId: string, noteId: string, updatedNote: Partial<Note>) => Promise<void>;
  deleteNote: (userId: string, noteId: string) => Promise<void>;
  setSelectedNote: (note: Note | null) => void;
  searchNotes: (userId: string, searchQuery: string) => Promise<void>;
}

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: [],
  categories: [],
  loading: false,
  selectedNote: null,
  
  searchNotes: async (userId: string, searchQuery: string) => {
    set({ loading: true });
    try {
      // First fetch all notes if they're not already loaded
      if (get().notes.length === 0) {
        await get().fetchNotes(userId);
      }
      
      // Filter notes client-side based on the search query
      const query = searchQuery.toLowerCase();
      const filteredNotes = get().notes.filter(note => 
        note.title.toLowerCase().includes(query) || 
        note.content.toLowerCase().includes(query) ||
        note.category.toLowerCase().includes(query)
      );
      
      set({ 
        notes: filteredNotes,
        loading: false 
      });
    } catch (error) {
      console.error("Error searching notes:", error);
      set({ loading: false });
    }
  },

  fetchNotes: async (userId: string) => {
    set({ loading: true });
    try {
      const notesRef = collection(db, 'users', userId, 'notes');
      const q = query(notesRef);
      const querySnapshot = await getDocs(q);
      
      const fetchedNotes: Note[] = [];
      querySnapshot.forEach((doc) => {
        const noteData = doc.data();
        fetchedNotes.push({
          id: doc.id,
          title: noteData.title,
          content: noteData.content,
          category: noteData.category || 'Uncategorized',
          date: noteData.date
        });
      });
      
      // Calculate categories
      const categoryCounts: Record<string, number> = {};
      fetchedNotes.forEach((note) => {
        categoryCounts[note.category] = (categoryCounts[note.category] || 0) + 1;
      });
      
      const formattedCategories = Object.entries(categoryCounts).map(([name, count]) => ({
        name,
        count,
      }));
      
      set({ 
        notes: fetchedNotes, 
        categories: formattedCategories,
        loading: false 
      });
    } catch (error) {
      console.error("Error fetching notes:", error);
      set({ loading: false });
    }
  },
  
  addNote: async (userId: string, note: Omit<Note, 'id'>) => {
    set({ loading: true });
    try {
      const notesRef = collection(db, 'users', userId, 'notes');
      await addDoc(notesRef, {
        ...note,
        category: note.category || 'Uncategorized',
        createdAt: new Date()
      });
      
      // Refresh notes
      await get().fetchNotes(userId);
    } catch (error) {
      console.error("Error adding note:", error);
      set({ loading: false });
    }
  },
  
  updateNote: async (userId: string, noteId: string, updatedNote: Partial<Note>) => {
    set({ loading: true });
    try {
      const noteRef = doc(db, 'users', userId, 'notes', noteId);
      await updateDoc(noteRef, {
        ...updatedNote,
        updatedAt: new Date()
      });
      
      // Refresh notes
      await get().fetchNotes(userId);
    } catch (error) {
      console.error("Error updating note:", error);
      set({ loading: false });
    }
  },
  
  deleteNote: async (userId: string, noteId: string) => {
    set({ loading: true });
    try {
      const noteRef = doc(db, 'users', userId, 'notes', noteId);
      await deleteDoc(noteRef);
      
      // Refresh notes
      await get().fetchNotes(userId);
    } catch (error) {
      console.error("Error deleting note:", error);
      set({ loading: false });
    }
  },
  
  setSelectedNote: (note: Note | null) => {
    set({ selectedNote: note });
  }
}));