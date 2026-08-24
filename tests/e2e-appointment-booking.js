// Automated E2E Test Suite for End-to-End Appointment Booking System
import assert from 'node:assert'

async function runE2EAppointmentBookingTests() {
  console.log('--- STARTING APPOINTMENT BOOKING SYSTEM E2E TEST SUITE ---')

  const BASE_URL = 'http://localhost:3000'
  const testUsername = `e2e_client_${Date.now()}`

  // 1. Create New Multi-Service Reservation via POST /api/v1/bookings
  console.log('1. Testing Multi-Service Reservation Creation...')
  const bookingPayload = {
    services: [
      { id: 'classic-precision-cut', name: 'Classic Precision Cut', category: 'For Him', price: 75 },
      { id: 'black-edition-beard-ritual', name: 'Black Edition Beard Ritual', category: 'For Him', price: 100 }
    ],
    stylistId: 'stylist-1',
    stylistName: 'Master Artisan Rahul',
    bookingDate: '2026-08-30',
    bookingTime: '11:30 AM',
    totalAmount: 175,
    username: testUsername
  }

  const createRes = await fetch(`${BASE_URL}/api/v1/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bookingPayload)
  })
  const createData = await createRes.json()
  assert.strictEqual(createRes.status, 200, 'Creation status should be 200')
  assert.ok(createData.booking.referenceId, 'Booking should generate reference ID')
  assert.strictEqual(createData.booking.status, 'CONFIRMED', 'New booking status must be CONFIRMED')
  console.log(`✅ Multi-Service Reservation Created (Ref: ${createData.booking.referenceId}, Total: ₹${createData.booking.totalAmount})`)

  const reservationId = createData.booking.id

  // 2. Query User Booking History via GET /api/v1/user/bookings
  console.log('2. Testing User Booking History Categorization (Upcoming vs Past vs Cancelled)...')
  const userBookingsRes = await fetch(`${BASE_URL}/api/v1/user/bookings?username=${testUsername}`)
  const userBookingsData = await userBookingsRes.json()
  assert.strictEqual(userBookingsRes.status, 200, 'User bookings query status should be 200')
  assert.strictEqual(userBookingsData.categorized.upcoming.length, 1, 'Should have 1 upcoming reservation')
  assert.strictEqual(userBookingsData.categorized.upcoming[0].referenceId, createData.booking.referenceId, 'Reference ID must match')
  console.log('✅ User Booking History Categorization PASSED')

  // 3. Query Admin Bookings Atelier Audit via GET /api/v1/admin/bookings
  console.log('3. Testing Admin Bookings Atelier Audit Query...')
  const adminBookingsRes = await fetch(`${BASE_URL}/api/v1/admin/bookings?status=CONFIRMED`)
  const adminBookingsData = await adminBookingsRes.json()
  assert.strictEqual(adminBookingsRes.status, 200, 'Admin bookings query status should be 200')
  const foundAdminItem = adminBookingsData.bookings.find(b => b.id === reservationId)
  assert.ok(foundAdminItem, 'New reservation must appear in Admin Bookings Atelier')
  console.log('✅ Admin Bookings Atelier Audit PASSED')

  // 4. Admin Modifies Booking via PUT /api/v1/admin/bookings/:id
  console.log(`4. Testing Admin Booking Modification via PUT /api/v1/admin/bookings/${reservationId}...`)
  const adminModifyRes = await fetch(`${BASE_URL}/api/v1/admin/bookings/${reservationId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bookingTime: '02:00 PM', stylistName: 'Senior Stylist Ananya' })
  })
  const adminModifyData = await adminModifyRes.json()
  assert.strictEqual(adminModifyRes.status, 200, 'Admin modify status should be 200')
  assert.strictEqual(adminModifyData.booking.bookingTime, '02:00 PM', 'Booking time must be updated to 02:00 PM')
  assert.strictEqual(adminModifyData.booking.stylistName, 'Senior Stylist Ananya', 'Stylist must be updated to Senior Stylist Ananya')
  console.log('✅ Admin Booking Modification PASSED')

  // 5. User Cancels Booking via PATCH /api/v1/user/bookings/:id/cancel
  console.log(`5. Testing User Reservation Cancellation via PATCH /api/v1/user/bookings/${reservationId}/cancel...`)
  const cancelRes = await fetch(`${BASE_URL}/api/v1/user/bookings/${reservationId}/cancel`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  })
  const cancelData = await cancelRes.json()
  assert.strictEqual(cancelRes.status, 200, 'Cancel status should be 200')
  assert.strictEqual(cancelData.booking.status, 'CANCELLED', 'Booking status must update to CANCELLED')
  console.log('✅ User Reservation Cancellation PASSED')

  console.log('--- ALL APPOINTMENT BOOKING SYSTEM E2E TESTS PASSED SUCCESSFULLY 🎉 ---')
}

runE2EAppointmentBookingTests().catch(err => {
  console.error('❌ APPOINTMENT BOOKING E2E TEST FAILED:', err)
  process.exit(1)
})
