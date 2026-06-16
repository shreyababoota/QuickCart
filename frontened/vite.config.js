// import { defineConfig, loadEnv } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'
// import { resolve } from 'path'

// export default defineConfig(({ mode }) => {
//   const env = loadEnv(mode, process.cwd(), '')

//   return {
//     plugins: [react(), tailwindcss()],

//     resolve: {
//       alias: {
//         '@': resolve(__dirname, './src'),
//       },
//     },

//     server: {
//       proxy: {
//         '/api/chat': env.VITE_AI_URL,
//         '/api/cart/intelligence': env.VITE_AI_URL,
//         '/api/cart/post-add-suggestion': env.VITE_AI_URL,
//       },
//     },
//   }
// })


import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  // server: {
  //   proxy: {
  //     '/api/chat': 'http://127.0.0.1:3001',
  //     '/api/cart/intelligence': 'http://127.0.0.1:3001',
  //     '/api/cart/post-add-suggestion': 'http://127.0.0.1:3001'
  //   }
  // }
})
