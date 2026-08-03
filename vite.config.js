import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Vite dev has no backend for anything under /api - this bridges the local
// serverless handlers so project and testimonial workflows behave like prod.
function localApiPlugin(env) {
  return {
    name: 'local-portfolio-api',
    configureServer(server) {
      const attachHandler = (apiPath, apiFile) => server.middlewares.use(apiPath, async (req, res) => {
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

        const handlerUrl = pathToFileURL(resolve(__dirname, apiFile)).href
        const { default: handler } = await import(`${handlerUrl}?t=${Date.now()}`)
        await handler(req, res)
      })

      attachHandler('/api/projects', 'api/projects.js')
      attachHandler('/api/testimonials', 'api/testimonials.js')
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), ...(command === 'serve' ? [localApiPlugin(env)] : [])],
    build: {
      chunkSizeWarningLimit: 1600,
    },
  }
})
