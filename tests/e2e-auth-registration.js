// Automated E2E Test Suite for AWS RDS User Registration & Login Authentication
import assert from 'node:assert'

async function runE2EAuthRegistrationTests() {
  console.log('--- STARTING AWS RDS USER REGISTRATION & LOGIN E2E TEST SUITE ---')

  const BASE_URL = 'http://localhost:3000'
  const testUsername = `user_rds_${Math.floor(1000 + Math.random() * 9000)}`
  const testPassword = 'Password2026!'

  // 1. Register New User in AWS RDS PostgreSQL
  console.log(`1. Testing User Registration for "${testUsername}"...`)
  const regRes = await fetch(`${BASE_URL}/api/v1/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: testUsername, password: testPassword })
  })
  const regData = await regRes.json()
  assert.strictEqual(regRes.status, 200, 'Registration status should be 200')
  assert.strictEqual(regData.success, true, 'Registration success must be true')
  assert.strictEqual(regData.user.username, testUsername, 'Returned user username must match')
  console.log(`✅ User Registration PASSED (User ID: ${regData.user.id}, Tier: ${regData.user.tier})`)

  // 2. Login with Newly Registered Credentials
  console.log(`2. Testing User Login for "${testUsername}"...`)
  const loginRes = await fetch(`${BASE_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: testUsername, password: testPassword })
  })
  const loginData = await loginRes.json()
  assert.strictEqual(loginRes.status, 200, 'Login status should be 200')
  assert.strictEqual(loginData.success, true, 'Login success must be true')
  assert.strictEqual(loginData.user.username, testUsername, 'Authenticated user username must match')
  console.log(`✅ User Login PASSED (User ID: ${loginData.user.id})`)

  // 3. Attempt Duplicate Registration with Same Username
  console.log(`3. Testing Duplicate Registration Error Handling for "${testUsername}"...`)
  const dupRes = await fetch(`${BASE_URL}/api/v1/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: testUsername, password: 'AnotherPassword' })
  })
  const dupData = await dupRes.json()
  assert.strictEqual(dupRes.status, 400, 'Duplicate registration status should be 400')
  assert.strictEqual(dupData.message, 'Username already taken', 'Error message must be "Username already taken"')
  console.log(`✅ Duplicate Registration Error Handling PASSED ("${dupData.message}")`)

  // 4. Attempt Login with Wrong Password
  console.log(`4. Testing Invalid Password Error Handling...`)
  const badLoginRes = await fetch(`${BASE_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: testUsername, password: 'WrongPassword123' })
  })
  const badLoginData = await badLoginRes.json()
  assert.strictEqual(badLoginRes.status, 401, 'Invalid password status should be 401')
  assert.strictEqual(badLoginData.message, 'Invalid username or password', 'Error message must match')
  console.log(`✅ Invalid Password Error Handling PASSED ("${badLoginData.message}")`)

  console.log('--- ALL AWS RDS USER REGISTRATION & LOGIN E2E TESTS PASSED SUCCESSFULLY 🎉 ---')
}

runE2EAuthRegistrationTests().catch(err => {
  console.error('❌ E2E TEST FAILED:', err)
  process.exit(1)
})
