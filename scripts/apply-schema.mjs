/**
 * Aplica supabase/schema.sql no projeto remoto.
 * Requer SUPABASE_DB_PASSWORD no .env.local (senha do banco em Settings → Database)
 */
import { readFileSync } from "fs"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import pg from "pg"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, "..")

function loadEnvLocal() {
  try {
    const raw = readFileSync(join(root, ".env.local"), "utf8")
    for (const line of raw.split("\n")) {
      const t = line.trim()
      if (!t || t.startsWith("#")) continue
      const i = t.indexOf("=")
      if (i === -1) continue
      const key = t.slice(0, i).trim()
      const val = t.slice(i + 1).trim()
      if (!process.env[key]) process.env[key] = val
    }
  } catch {
    /* ignore */
  }
}

loadEnvLocal()

const password = process.env.SUPABASE_DB_PASSWORD
if (!password) {
  console.error(
    "Adicione SUPABASE_DB_PASSWORD no .env.local (Settings → Database → Database password)"
  )
  process.exit(1)
}

const sql = readFileSync(join(root, "supabase", "schema.sql"), "utf8")
const regions = [
  "sa-east-1",
  "us-east-1",
  "us-west-1",
  "eu-west-1",
  "ap-southeast-1",
]

const connectionString = process.env.DATABASE_URL

async function tryConnect(uri) {
  const client = new pg.Client({ connectionString: uri, ssl: { rejectUnauthorized: false } })
  await client.connect()
  await client.query(sql)
  await client.end()
  return true
}

if (connectionString) {
  try {
    await tryConnect(connectionString)
    console.log("Schema aplicado com sucesso.")
    process.exit(0)
  } catch (err) {
    console.error("Erro:", err.message)
    process.exit(1)
  }
}

let lastError = ""
for (const region of regions) {
  const uri = `postgresql://postgres.ybgnfmmjjcjyhchmmlwm:${encodeURIComponent(password)}@aws-0-${region}.pooler.supabase.com:6543/postgres`
  try {
    await tryConnect(uri)
    console.log(`Schema aplicado com sucesso (região ${region}).`)
    process.exit(0)
  } catch (err) {
    lastError = err.message
  }
}

console.error("Erro ao aplicar schema:", lastError)
console.error(
  "\nAlternativa: abra o SQL Editor e execute supabase/schema.sql\n" +
    "https://supabase.com/dashboard/project/ybgnfmmjjcjyhchmmlwm/sql/new"
)
process.exit(1)
