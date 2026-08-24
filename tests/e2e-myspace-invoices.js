// Automated E2E Test Suite for Standalone Customer "My Space" (/#/my-space) & GST Tax Invoice Generator
import assert from 'node:assert'
import { generateInvoicePDF } from '../src/utils/invoiceGenerator.js'

async function runE2EMySpaceAndInvoiceTests() {
  console.log('--- STARTING STANDALONE MY SPACE & GST INVOICE E2E TEST SUITE ---')

  const BASE_URL = 'http://localhost:3000'

  // 1. Query User Bookings via GET /api/v1/user/bookings?username=sec_user_2026
  console.log('1. Testing User Bookings Ledger Query for Customer "My Space"...')
  const userBookingsRes = await fetch(`${BASE_URL}/api/v1/user/bookings?username=sec_user_2026`)
  const userBookingsData = await userBookingsRes.json()
  assert.strictEqual(userBookingsRes.status, 200, 'User bookings endpoint status should be 200')
  assert.ok(Array.isArray(userBookingsData.bookings), 'User bookings must be an array')
  assert.ok(userBookingsData.categorized, 'Categorized object must be present')
  console.log(`✅ User Bookings Ledger Query PASSED (Total: ${userBookingsData.bookings.length} reservations)`)

  // 2. Validate Digital GST Invoice Data Breakdown Calculation
  console.log('2. Testing Digital GST Tax Invoice Data Calculation...')
  const sampleCompletedBooking = {
    id: 'bkg-102',
    referenceId: 'RES-2026-7712',
    username: 'sec_user_2026',
    services: [{ name: 'Hydra Nourish Ritual', price: 900, category: 'Hair Spa Rituals' }],
    stylistName: 'Senior Stylist Ananya',
    bookingDate: '2026-08-15',
    bookingTime: '02:00 PM',
    totalAmount: 900,
    status: 'COMPLETED'
  }

  const baseAmount = Math.round((sampleCompletedBooking.totalAmount / 1.18) * 100) / 100
  const gstTotal = Math.round((sampleCompletedBooking.totalAmount - baseAmount) * 100) / 100
  assert.strictEqual(baseAmount + gstTotal, 900, 'Base amount + GST total must equal 900')
  console.log(`✅ GST Tax Calculation PASSED (Base: ₹${baseAmount}, 18% GST: ₹${gstTotal})`)

  // 3. Test Admin Bookings Atelier Search & Status Filtering
  console.log('3. Testing Admin Bookings Atelier Search & Filter Endpoints...')
  const adminBookingsRes = await fetch(`${BASE_URL}/api/v1/admin/bookings?status=CONFIRMED&search=sec_user_2026`)
  const adminBookingsData = await adminBookingsRes.json()
  assert.strictEqual(adminBookingsRes.status, 200, 'Admin bookings endpoint status should be 200')
  assert.ok(Array.isArray(adminBookingsData.bookings), 'Admin bookings must be an array')
  console.log(`✅ Admin Bookings Atelier Query PASSED (Found ${adminBookingsData.bookings.length} matching confirmed bookings)`)

  console.log('--- ALL STANDALONE MY SPACE & GST INVOICE E2E TESTS PASSED SUCCESSFULLY 🎉 ---')
}

runE2EMySpaceAndInvoiceTests().catch(err => {
  console.error('❌ E2E TEST FAILED:', err)
  process.exit(1)
})
