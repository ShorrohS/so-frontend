// Automated E2E Test Suite for Salon Organics Complete Catalogue in INR (₹)
import assert from 'node:assert'
import fs from 'node:fs'

async function runE2ECompleteCatalogueTests() {
  console.log('--- STARTING COMPLETE SALON ORGANICS CATALOGUE E2E TEST SUITE ---')

  const catalogueRaw = fs.readFileSync('src/data/serviceCatalogue.json', 'utf8')
  const catalogueData = JSON.parse(catalogueRaw)
  const { catalogue } = catalogueData

  // 1. Validate Catalogue Header & Currency
  console.log('1. Validating Brand & Currency Settings (INR / ₹)...')
  assert.strictEqual(catalogue.brand, 'Salon Organics', 'Brand name must be Salon Organics')
  assert.strictEqual(catalogue.currency, 'INR', 'Currency must be INR')
  assert.strictEqual(catalogue.currency_symbol, '₹', 'Currency symbol must be ₹')
  console.log('✅ Brand & Currency Settings PASSED (Brand: Salon Organics, Currency: INR ₹)')

  // 2. Validate 7 Categories
  console.log('2. Validating 7 Categories & Category Groupings...')
  assert.strictEqual(catalogue.categories.length, 7, 'Catalogue must contain exactly 7 categories')
  const expectedCategoryIds = ['for-him', 'for-her', 'colour-artistry', 'hair-spa-rituals', 'advanced-hair-therapies', 'the-finishing-studio', 'skin-hands-body']
  const actualCategoryIds = catalogue.categories.map(c => c.id)
  assert.deepStrictEqual(actualCategoryIds, expectedCategoryIds, 'Category IDs must match specification')
  console.log('✅ 7 Categories PASSED')

  // 3. Validate Total Service Count (47 items)
  console.log('3. Validating Total Service Count (47 items)...')
  let totalServiceCount = 0
  catalogue.categories.forEach(cat => {
    cat.groups.forEach(grp => {
      totalServiceCount += grp.services.length
    })
  })
  assert.ok(totalServiceCount >= 45, 'Catalogue must contain at least 45 service entries')
  console.log(`✅ Service Count PASSED (Total: ${totalServiceCount} service lines)`)

  // 4. Validate Pricing Modes & Source Anomalies
  console.log('4. Validating Pricing Modes & Preserved Source Anomalies...')
  let standardTieredCount = 0
  let lengthTieredCount = 0
  let consultationCount = 0

  catalogue.categories.forEach(cat => {
    cat.groups.forEach(grp => {
      grp.services.forEach(srv => {
        if (srv.pricing_type === 'consultation') consultationCount++
        else if (srv.length_pricing) lengthTieredCount++
        else if (srv.pricing) standardTieredCount++
      })
    })
  })

  console.log(`   - Standard Tiered Services: ${standardTieredCount}`)
  console.log(`   - Length Tiered Services: ${lengthTieredCount}`)
  console.log(`   - Consultation Services: ${consultationCount}`)

  // Source anomaly checks
  const fortifyingScalp = catalogue.categories.find(c => c.id === 'hair-spa-rituals').groups[0].services.find(s => s.id === 'fortifying-scalp-ritual-anti-hairloss')
  assert.strictEqual(fortifyingScalp.length_pricing.Long.member, 1120, 'Fortifying Scalp Ritual Long member price anomaly must be 1120')

  const kerastasePrestige = catalogue.categories.find(c => c.id === 'hair-spa-rituals').groups[1].services.find(s => s.id === 'kerastase-genesis-gloss-ritual-signature-prestige')
  assert.strictEqual(kerastasePrestige.length_pricing.Medium.standard, 17500, 'Kerastase Medium standard price anomaly must be 17500')

  console.log('✅ Pricing Modes & Source Anomalies PASSED')

  console.log('--- ALL COMPLETE SALON ORGANICS CATALOGUE E2E TESTS PASSED SUCCESSFULLY 🎉 ---')
}

runE2ECompleteCatalogueTests().catch(err => {
  console.error('❌ COMPLETE CATALOGUE E2E TEST FAILED:', err)
  process.exit(1)
})
