// Automated E2E Test Suite for Salon Seat Capacity, Stylist Concurrency (HTTP 409) & My Salon Atelier
import assert from 'node:assert'

async function runE2ESalonCapacityConcurrencyTests() {
  console.log('--- STARTING SALON CAPACITY & HTTP 409 CONCURRENCY E2E TEST SUITE ---')

  const BASE_URL = 'http://localhost:3000'
  const dateStr = '2026-09-01'
  const timeStr = '11:30 AM'

  // 1. Query Admin My Salon Info via GET /api/v1/admin/salon
  console.log('1. Testing Admin My Salon Capacity & Stylists Atelier Query...')
  const salonRes = await fetch(`${BASE_URL}/api/v1/admin/salon`)
  const salonData = await salonRes.json()
  assert.strictEqual(salonRes.status, 200, 'My Salon endpoint status should be 200')
  assert.ok(salonData.capacity.totalSeats >= 1, 'Total seats must be >= 1')
  assert.ok(Array.isArray(salonData.stylists), 'Stylists must be an array')
  console.log(`✅ Admin My Salon Query PASSED (Total Working Seats: ${salonData.capacity.totalSeats})`)

  // 2. Client A Confirms Reservation for Master Artisan Rahul at 11:30 AM on 2026-09-01
  console.log('2. Client A Booking Master Artisan Rahul (stylist-1) at 11:30 AM...')
  const clientAPayload = {
    services: [{ id: 'classic-precision-cut', name: 'Classic Precision Cut', price: 75 }],
    stylistId: 'stylist-1',
    stylistName: 'Master Artisan Rahul',
    bookingDate: dateStr,
    bookingTime: timeStr,
    totalAmount: 75,
    username: 'client_A_2026'
  }

  const clientARes = await fetch(`${BASE_URL}/api/v1/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(clientAPayload)
  })
  const clientAData = await clientARes.json()
  assert.strictEqual(clientARes.status, 200, 'Client A reservation status should be 200')
  assert.strictEqual(clientAData.booking.status, 'CONFIRMED', 'Client A booking must be CONFIRMED')
  console.log(`✅ Client A Reservation PASSED (Ref: ${clientAData.booking.referenceId})`)

  // 3. Client B Attempts Duplicate Booking for Master Artisan Rahul at 11:30 AM on 2026-09-01 -> Validating HTTP 409 Conflict
  console.log('3. Client B Attempting Duplicate Booking for Master Artisan Rahul (stylist-1) at 11:30 AM (Validating HTTP 409 Conflict)...')
  const clientBPayload = {
    services: [{ id: 'black-edition-cut', name: 'Black Edition Cut', price: 125 }],
    stylistId: 'stylist-1',
    stylistName: 'Master Artisan Rahul',
    bookingDate: dateStr,
    bookingTime: timeStr,
    totalAmount: 125,
    username: 'client_B_2026'
  }

  const clientBRes = await fetch(`${BASE_URL}/api/v1/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(clientBPayload)
  })
  const clientBData = await clientBRes.json()
  assert.strictEqual(clientBRes.status, 409, 'Client B reservation MUST return HTTP 409 Conflict')
  assert.strictEqual(clientBData.code, 'STYLIST_UNAVAILABLE', 'Error code must be STYLIST_UNAVAILABLE')
  console.log(`✅ Real-Time Stylist Concurrency HTTP 409 Conflict PASSED ("${clientBData.message}")`)

  // 4. Admin Updates Salon Capacity & Adds New Stylist via POST /api/v1/admin/stylists
  console.log('4. Testing Admin Add New Stylist & Capacity Update...')
  const addStylistRes = await fetch(`${BASE_URL}/api/v1/admin/stylists`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Master Artisan Vikram',
      specialization: 'Botanical Hair & Scalp Therapy',
      description: 'Senior organic specialist'
    })
  })
  const addStylistData = await addStylistRes.json()
  assert.strictEqual(addStylistRes.status, 200, 'Add stylist status should be 200')
  assert.strictEqual(addStylistData.stylist.name, 'Master Artisan Vikram', 'Stylist name must match')
  console.log(`✅ Admin Add New Stylist PASSED (ID: ${addStylistData.stylist.id})`)

  console.log('--- ALL SALON CAPACITY & HTTP 409 CONCURRENCY E2E TESTS PASSED SUCCESSFULLY 🎉 ---')
}

runE2ESalonCapacityConcurrencyTests().catch(err => {
  console.error('❌ SALON CAPACITY E2E TEST FAILED:', err)
  process.exit(1)
})
