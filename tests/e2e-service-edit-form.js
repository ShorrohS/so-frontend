// Automated E2E Test Suite for Admin Service Form Restoration, Edit Workflow & 3-Tier Prices (INR ₹)
import assert from 'node:assert'

async function runE2EServiceEditFormTests() {
  console.log('--- STARTING ADMIN SERVICE EDIT FORM & 3-TIER INR (₹) E2E TEST SUITE ---')

  const BASE_URL = 'http://localhost:3000'

  // 1. Create New Service with Complete Fields & 3-Tier Pricing in INR (₹)
  console.log('1. Testing Single Service Item Creation with Full Fields...')
  const createPayload = {
    name: 'Kérastase Genesis Prestige Gloss',
    category: 'Hair Spa Rituals',
    subcategory: 'Prestige & Organic Rituals',
    description: 'Prestige Kérastase Genesis treatment that fortifies, glosses and revitalises for mirror-like shine.',
    bestForTag: 'Anti-breakage & Mirror shine',
    imageUrl: '/images/service-[#].jpg',
    isVisible: true,
    durationMinutes: 60,
    pricing: {
      standard: 17500,
      member: 10000,
      vip: 7500
    }
  }

  const createRes = await fetch(`${BASE_URL}/api/v1/admin/services`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(createPayload)
  })
  const createData = await createRes.json()
  assert.strictEqual(createRes.status, 200, 'Creation status should be 200')
  assert.ok(createData.service.id, 'Created service should return unique ID')
  assert.strictEqual(createData.service.pricing.standard, 17500, 'Standard price in ₹ must match')
  assert.strictEqual(createData.service.pricing.member, 10000, 'Member price in ₹ must match')
  assert.strictEqual(createData.service.pricing.vip, 7500, 'VIP price in ₹ must match')
  console.log(`✅ Single Service Creation PASSED (ID: ${createData.service.id}, Standard: ₹${createData.service.pricing.standard})`)

  const newServiceId = createData.service.id

  // 2. Test Editing Service Item via PUT /api/v1/admin/services/:id
  console.log(`2. Testing Service Item Update via PUT /api/v1/admin/services/${newServiceId}...`)
  const updatePayload = {
    name: 'Kérastase Genesis Prestige Gloss (Updated)',
    description: 'Updated description: Intensive anti-breakage & mirror glaze gloss finish.',
    pricing: {
      standard: 18000,
      member: 10500,
      vip: 8000
    }
  }

  const updateRes = await fetch(`${BASE_URL}/api/v1/admin/services/${newServiceId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatePayload)
  })
  const updateData = await updateRes.json()
  assert.strictEqual(updateRes.status, 200, 'Update status should be 200')
  assert.strictEqual(updateData.service.name, 'Kérastase Genesis Prestige Gloss (Updated)', 'Updated name must match')
  assert.strictEqual(updateData.service.pricing.standard, 18000, 'Updated standard price must be ₹18,000')
  assert.strictEqual(updateData.service.pricing.member, 10500, 'Updated member price must be ₹10,500')
  console.log('✅ Service Edit & PUT Update PASSED (Successfully updated pricing and description)')

  // 3. Verify Reflection in GET /api/v1/admin/services Catalog Query
  console.log('3. Verifying Reflection in Admin Service Catalog Query...')
  const catalogRes = await fetch(`${BASE_URL}/api/v1/admin/services?limit=100`)
  const catalogData = await catalogRes.json()
  assert.strictEqual(catalogRes.status, 200, 'Catalog status should be 200')
  const updatedItem = catalogData.items.find(s => s.id === newServiceId)
  assert.ok(updatedItem, 'Updated item must be found in catalog')
  assert.strictEqual(updatedItem.name, 'Kérastase Genesis Prestige Gloss (Updated)', 'Item name in catalog must reflect update')
  console.log('✅ Service Reflection in Catalog Query PASSED')

  console.log('--- ALL ADMIN SERVICE EDIT FORM & 3-TIER INR (₹) E2E TESTS PASSED SUCCESSFULLY 🎉 ---')
}

runE2EServiceEditFormTests().catch(err => {
  console.error('❌ SERVICE EDIT FORM E2E TEST FAILED:', err)
  process.exit(1)
})
