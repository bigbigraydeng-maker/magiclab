import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

const envFile = readFileSync('.env.local', 'utf-8')
const envVars = {}
envFile.split('\n').forEach(line => {
  const match = line.match(/^([A-Z_]+)=(.*)$/)
  if (match) envVars[match[1]] = match[2].replace(/^["']|["']$/g, '').split('#')[0].trim()
})

const supabase = createClient(
  envVars.NEXT_PUBLIC_SUPABASE_URL,
  envVars.SUPABASE_SERVICE_ROLE_KEY
)

const clientId = 'c0000000-0000-0000-0000-000000000000'

const { data: snap } = await supabase
  .from('ai_visibility_snapshots')
  .select('*')
  .eq('client_id', clientId)
  .order('created_at', { ascending: false })
  .limit(2)

console.log('=== Latest 2 Snapshots (all fields) ===')
console.log(JSON.stringify(snap, null, 2))

const cutoff = new Date(Date.now() - 15 * 60 * 1000).toISOString()
const { data: runs } = await supabase
  .from('ai_visibility_runs')
  .select('ai_engine, ai_model, error_message, latency_ms, tokens_used, cost_usd, ran_at, brands_mentioned, client_brand_rank')
  .eq('client_id', clientId)
  .gte('ran_at', cutoff)
  .order('ran_at', { ascending: false })

console.log(`\n=== Runs in last 90 minutes: ${runs?.length || 0} ===`)
console.log(`Cutoff timestamp: ${cutoff}`)
if (runs && runs.length > 0) {
  console.log(`Time range: ${runs[runs.length-1].ran_at} → ${runs[0].ran_at}`)
}
const { count: totalCount } = await supabase
  .from('ai_visibility_runs')
  .select('*', { count: 'exact', head: true })
console.log(`\n=== Total rows in ai_visibility_runs (all clients): ${totalCount} ===`)

const { data: anyRuns, error: anyErr } = await supabase
  .from('ai_visibility_runs')
  .select('id, ai_engine, ran_at, created_at, client_id, error_message, brands_mentioned, client_brand_rank')
  .order('created_at', { ascending: false, nullsFirst: false })
  .limit(10)

console.log(`\n=== 10 most recent runs (ALL clients) ===`)
if (anyErr) console.error('Query error:', anyErr)
anyRuns?.forEach(r => console.log(`  ${r.created_at} | ${r.ai_engine} | client=${r.client_id?.substring(0,8)} | rank=${r.client_brand_rank} | brands=${Array.isArray(r.brands_mentioned)?r.brands_mentioned.length:0} | err=${r.error_message?.substring(0,40)||'-'}`))

if (runs && runs.length > 0) {
  const stats = {}
  runs.forEach(r => {
    if (!stats[r.ai_engine]) stats[r.ai_engine] = { total: 0, runner_success: 0, runner_errors: 0, errorMessages: {} }
    stats[r.ai_engine].total++
    if (!r.error_message) stats[r.ai_engine].runner_success++
    else {
      stats[r.ai_engine].runner_errors++
      const msg = r.error_message?.substring(0, 100) || 'unknown'
      stats[r.ai_engine].errorMessages[msg] = (stats[r.ai_engine].errorMessages[msg] || 0) + 1
    }
  })
  console.log('\n=== Stats by Engine (runner success = no error_message) ===')
  console.log(JSON.stringify(stats, null, 2))

  const successfulRunner = runs.filter(r => !r.error_message)
  const withBrands = successfulRunner.filter(r => Array.isArray(r.brands_mentioned) && r.brands_mentioned.length > 0)
  console.log(`\n=== Parser Performance ===`)
  console.log(`Runner-successful runs: ${successfulRunner.length}`)
  console.log(`Runs with brands extracted: ${withBrands.length}`)
  console.log(`Parser success rate: ${successfulRunner.length > 0 ? ((withBrands.length / successfulRunner.length) * 100).toFixed(1) + '%' : 'N/A'}`)

  const rateLimitErrors = runs.filter(r => r.error_message?.toLowerCase().includes('rate'))
  console.log(`\n=== Rate Limit Errors: ${rateLimitErrors.length} ===`)

  // Show full Gemini errors
  const googleErrors = runs.filter(r => r.ai_engine === 'google' && r.error_message)
  if (googleErrors.length > 0) {
    console.log('\n=== Gemini Error Details ===')
    googleErrors.forEach(r => console.log(' -', r.error_message?.substring(0, 200)))
  }
}
