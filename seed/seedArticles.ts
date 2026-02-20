import { createClient } from '@supabase/supabase-js'
import { readFile } from 'fs/promises'
import 'dotenv/config'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function seedArticles() {
  console.log('Seeding articles...')

  const file = await readFile('./seed/articles.json', 'utf-8')
  const articles = JSON.parse(file)

  const { error } = await supabase
    .from('articles')
    .upsert(articles, { onConflict: 'slug' })

  if (error) {
    console.error('❌ Error inserting articles:', error)
  }
  console.log('✅ Articles seeded successfully')
}

seedArticles()