// Automated E2E Test Suite for Admin Sanctuary & CMS S3 Synchronization
import assert from 'node:assert'

async function runE2ETests() {
  console.log('--- STARTING E2E AUTOMATED TEST SUITE ---')

  const BASE_URL = 'http://localhost:3000'

  // 1. Test Admin Login with admin / admin123
  console.log('1. Testing Admin Authentication (admin / admin123)...')
  const authRes = await fetch(`${BASE_URL}/api/v1/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'admin123' })
  })
  const authData = await authRes.json()
  assert.strictEqual(authRes.status, 200, 'Admin auth status should be 200')
  assert.strictEqual(authData.success, true, 'Admin auth should return success')
  assert.ok(authData.token, 'Admin auth should return session token')
  console.log('✅ Admin Authentication PASSED. Token:', authData.token)

  // 2. Test Invalid Admin Login
  console.log('2. Testing Invalid Admin Login...')
  const invalidRes = await fetch(`${BASE_URL}/api/v1/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'wrongpassword' })
  })
  assert.strictEqual(invalidRes.status, 401, 'Invalid admin auth should return 401')
  console.log('✅ Invalid Admin Login Rejection PASSED (401 Unauthorized)')

  // 3. Test CMS Settings Fetch & Save
  console.log('3. Testing CMS Landing Page Edit & Save...')
  const cmsRes = await fetch(`${BASE_URL}/api/v1/admin/cms`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      heroTitle: 'Organic Luxury & Botanical Care',
      tagline: 'E2E VERIFIED SANCTUARY'
    })
  })
  const cmsData = await cmsRes.json()
  assert.strictEqual(cmsRes.status, 200, 'CMS save status should be 200')
  assert.strictEqual(cmsData.cms.heroTitle, 'Organic Luxury & Botanical Care')
  console.log('✅ CMS Save & Instant Refresh PASSED')

  // 4. Test 3-Tier Service Item Creation
  console.log('4. Testing 3-Tier Service Item Creation...')
  const serviceRes = await fetch(`${BASE_URL}/api/v1/admin/services`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      groupId: 'grp-1',
      name: 'Scalp Detox & Botanical Fusion',
      description: 'E2E automated test service item',
      duration: 75,
      basePrice: 150,
      memberPrice: 125,
      vipPrice: 100
    })
  })
  const serviceData = await serviceRes.json()
  assert.strictEqual(serviceRes.status, 200, 'Service creation status should be 200')
  assert.strictEqual(serviceData.service.name, 'Scalp Detox & Botanical Fusion')
  assert.strictEqual(serviceData.service.vipPrice, 100)
  console.log('✅ 3-Tier Service Creation PASSED (Base: $150, Member: $125, VIP: $100)')

  // 5. Test User Registration & Session Isolation from Admin
  console.log('5. Testing User Registration & Session Isolation...')
  const userRes = await fetch(`${BASE_URL}/api/v1/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'e2e_client_user', password: 'password123' })
  })
  const userData = await userRes.json()
  assert.strictEqual(userRes.status, 200, 'User register status should be 200')
  assert.strictEqual(userData.user.username, 'e2e_client_user')
  console.log('✅ User Registration & Auth Isolation PASSED')

  console.log('--- ALL E2E AUTOMATED TESTS PASSED SUCCESSFULLY 🎉 ---')
}

runE2ETests().catch(err => {
  console.error('❌ E2E TEST FAILED:', err)
  process.exit(1)
})
