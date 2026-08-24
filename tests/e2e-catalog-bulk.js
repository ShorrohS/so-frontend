// Automated E2E Test Suite for Scalable Catalog, Pagination, Bulk CSV Import & Reordering
import assert from 'node:assert'

async function runE2ECatalogTests() {
  console.log('--- STARTING CATALOG & BULK IMPORT E2E TEST SUITE ---')

  const BASE_URL = 'http://localhost:3000'

  // 1. Test Paginated Service Retrieval
  console.log('1. Testing Paginated Service Catalog Retrieval (page=1, limit=2)...')
  const pageRes = await fetch(`${BASE_URL}/api/v1/admin/services?page=1&limit=2`)
  const pageData = await pageRes.json()
  assert.strictEqual(pageRes.status, 200, 'Paginated fetch status should be 200')
  assert.strictEqual(pageData.page, 1, 'Page should be 1')
  assert.strictEqual(pageData.items.length, 2, 'Page items length should be 2')
  assert.ok(pageData.total >= 5, 'Total catalog count should be at least 5')
  console.log(`✅ Paginated Retrieval PASSED (Returned ${pageData.items.length} items of ${pageData.total} total)`)

  // 2. Test Numerical Coercion on Service Creation
  console.log('2. Testing Numerical Price & Duration Coercion...')
  const coerceRes = await fetch(`${BASE_URL}/api/v1/admin/services`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Organic Herbal Scalp Fusion',
      category: 'Sanctuary Hair Rituals',
      basePrice: '140.50',
      memberPrice: '115.00',
      vipPrice: '95.00',
      durationMinutes: '75'
    })
  })
  const coerceData = await coerceRes.json()
  assert.strictEqual(coerceRes.status, 200, 'Service creation should succeed without 400 Bad Request')
  assert.strictEqual(typeof coerceData.service.pricing.base, 'number', 'Base price must be coerced to number')
  assert.strictEqual(coerceData.service.pricing.base, 140.5, 'Base price coerced value should match')
  assert.strictEqual(coerceData.service.durationMinutes, 75, 'Duration coerced value should match')
  console.log('✅ Numerical Coercion PASSED (String inputs safely converted to numbers)')

  // 3. Test Bulk CSV/JSON Import
  console.log('3. Testing Bulk Import (JSON array of 3 items)...')
  const bulkItems = [
    { name: 'Bulk Ritual 1', category: 'Sanctuary Hair Rituals', basePrice: 100, memberPrice: 80, vipPrice: 65, durationMinutes: 45 },
    { name: 'Bulk Ritual 2', category: 'Botanical Colouring', basePrice: 150, memberPrice: 120, vipPrice: 100, durationMinutes: 90 },
    { name: 'Bulk Ritual 3', category: 'Sanctuary Hair Rituals', basePrice: 200, memberPrice: 170, vipPrice: 140, durationMinutes: 120 }
  ]
  const bulkRes = await fetch(`${BASE_URL}/api/v1/admin/services/bulk`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items: bulkItems })
  })
  const bulkData = await bulkRes.json()
  assert.strictEqual(bulkRes.status, 200, 'Bulk import status should be 200')
  assert.strictEqual(bulkData.importedCount, 3, 'Imported count should be 3')
  console.log(`✅ Bulk Import PASSED (Successfully imported ${bulkData.importedCount} items. Total catalog: ${bulkData.totalCount})`)

  // 4. Test UP/DOWN Reordering
  console.log('4. Testing UP/DOWN Display Order Reordering...')
  const reorderRes = await fetch(`${BASE_URL}/api/v1/admin/services/reorder`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: 'srv-2', direction: 'up' })
  })
  const reorderData = await reorderRes.json()
  assert.strictEqual(reorderRes.status, 200, 'Reorder status should be 200')
  console.log('✅ UP/DOWN Display Order Reordering PASSED')

  console.log('--- ALL CATALOG & BULK E2E TESTS PASSED SUCCESSFULLY 🎉 ---')
}

runE2ECatalogTests().catch(err => {
  console.error('❌ CATALOG E2E TEST FAILED:', err)
  process.exit(1)
})
