import { createClient } from '@supabase/supabase-js'
import { readFile } from 'fs/promises'
import 'dotenv/config'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function seedProfile() {
  console.log('Seeding profile...')

  const file = await readFile('./seed/profile.json', 'utf-8')
  const profile = JSON.parse(file)

  const { error } = await supabase
    .from('profile')
    .upsert(profile, { onConflict: 'slug' })

  if (error) {
    console.error('❌ Error inserting profile:', error)
  }
  console.log('✅ Profile seeded successfully')
}

seedProfile()