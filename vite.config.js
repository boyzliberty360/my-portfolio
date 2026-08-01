import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))

// vite dev has no backend for anything under /api — that's a Vercel-only
// concept. This bridges /api/projects to the real serverless handler in
// api/projects.js so `vite dev` behaves like production instead of 404ing.
function localProjectsApiPlugin(env) {
  return {
    name: 'local-projects-api',
    configureServer(server) {
      server.middlewares.use('/api/projects', async (req, res) => {
        for (const key of ['ADMIN_PASSWORD', 'BLOB_READ_WRITE_TOKEN', 'BLOB_STORE_ID']) {
          if (env[key]) process.env[key] = env[key]
        }

        const chunks = []
        for await (const chunk of req) chunks.push(chunk)
        const raw = Buffer.concat(chunks).toString('utf8')
        req.body = raw ? JSON.parse(raw) : undefined

        res.status = (code) => {
          res.statusCode = code
          return res
        }
        res.json = (body) => {
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(body))
          return res
        }

        const handlerUrl = pathToFileURL(resolve(__dirname, 'api/projects.js')).href
        const { default: handler } = await import(`${handlerUrl}?t=${Date.now()}`)
        await handler(req, res)
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), ...(command === 'serve' ? [localProjectsApiPlugin(env)] : [])],
    build: {
      chunkSizeWarningLimit: 1600,
    },
  }
})
