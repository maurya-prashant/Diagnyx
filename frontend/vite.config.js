// import { defineConfig, loadEnv } from 'vite'
// import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'

// export default defineConfig(({ mode }) => {

//   const env = loadEnv(mode, process.cwd(), '')
//   const backendUrl = env.VITE_API_URL || 'http://127.0.0.1:8000'

//   return {
//     plugins: [react(), tailwindcss()],
//     server: {
//       proxy: {
//         '/api': {
//           target: backendUrl,
//           changeOrigin: true,
//           rewrite: path => path.replace(/^\/api/, ''),
//         },
//         '/upload': {
//           target: backendUrl,
//           changeOrigin: true,
//         },
//       },
//     },
//   }
// })

import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  const backendUrl =
    env.VITE_API_URL || 'http://127.0.0.1:8000'

  return {
    plugins: [react(), tailwindcss()],

    server: {
      proxy: {
        '/api': {
          target: backendUrl,
          changeOrigin: true,
        },

        '/upload': {
          target: backendUrl,
          changeOrigin: true,
        },
      },
    },
  }
})