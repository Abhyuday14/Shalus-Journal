import { createClient } from '@supabase/supabase-js'
import { readFile } from 'fs/promises'
import 'dotenv/config'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function seedCategories() {
  console.log('Seeding categories...')

  const file = await readFile('./seed/categories.json', 'utf-8')
  const categories = JSON.parse(file)

  const { error } = await supabase
    .from('categories')
    .upsert(categories, { onConflict: 'slug' })

  if (error) {
    console.error('❌ Error inserting categories:', error)
  }
  console.log('✅ categories seeded successfully')
}

seedCategories()