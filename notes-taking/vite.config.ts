import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
 
export default defineConfig({
  plugins: [react()],
  // base:"https://divyadhiman22.github.io/MyNotes/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})