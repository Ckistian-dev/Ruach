import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/', // 👈 Isso garante que todas as rotas partam da raiz
  plugins: [react()],
})
