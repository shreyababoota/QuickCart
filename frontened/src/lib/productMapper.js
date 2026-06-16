const CATEGORY_EMOJI = {
  electronics: '📱',
  fashion: '👗',
  'home & kitchen': '🏠',
  'home-kitchen': '🏠',
  grocery: '🛒',
  'grocery & essentials': '🛒',
  beauty: '💄',
  'beauty & personal care': '💄',
  books: '📚',
  sports: '⚽',
  'sports & fitness': '⚽',
  toys: '🎮',
  'toys & games': '🎮',
  automotive: '🚗',
  pets: '🐾',
  'pet supplies': '🐾',
}

const CATEGORY_GRADIENT = {
  electronics: 'from-sky-100 to-blue-100',
  fashion: 'from-pink-100 to-rose-100',
  'home & kitchen': 'from-amber-100 to-orange-100',
  grocery: 'from-lime-100 to-green-100',
  beauty: 'from-violet-100 to-purple-100',
  books: 'from-yellow-100 to-amber-100',
  sports: 'from-emerald-100 to-teal-100',
  toys: 'from-fuchsia-100 to-pink-100',
  automotive: 'from-slate-100 to-zinc-100',
  pets: 'from-orange-100 to-amber-100',
}

function hashString(value = '') {
  let hash = 0
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

export function normalizeProduct(raw, index = 0) {
  if (!raw) return null

  const category = (raw.category || 'general').toLowerCase()
  const productCode = raw.product_code || raw.product_id || String(raw.id)
  const price = Number(raw.price) || 0
  const codeHash = hashString(productCode)

  return {
    id: productCode,
    backendId: raw.id,
    productCode,
    name: raw.name,
    emoji: CATEGORY_EMOJI[category] || '📦',
    category,
    brand: raw.brand || '',
    price,
    originalPrice: raw.original_price ?? null,
    mrp: raw.mrp ?? Math.round(price * 1.15),
    rating: raw.rating ?? (4 + (codeHash % 10) / 10),
    reviews: raw.reviews ?? (100 + (codeHash % 900)),
    stock: raw.stock ?? 0,
    unit: raw.unit || '1 unit',
    description: raw.description || '',
    gradient: CATEGORY_GRADIENT[category] || 'from-slate-100 to-gray-100',
    trending: index % 3 === 0,
    featured: index % 4 === 0,
    expiryDate: raw.expiry_date || null,
    expiryLabel: raw.expiry_label || null,
    expiryDiscountPercent: raw.expiry_discount_percent || 0,
    daysUntilExpiry: raw.days_until_expiry ?? null,
    tags: raw.tags || '',
  }
}

export function normalizeProducts(list = []) {
  return list.map((item, index) => normalizeProduct(item, index)).filter(Boolean)
}

/** True when value is a positive integer database primary key. */
export function isNumericProductId(value) {
  if (value == null || value === '') return false
  const n = Number(value)
  return Number.isInteger(n) && n > 0
}

/** Looks like a catalog code (e.g. P001) rather than a numeric DB id. */
function looksLikeProductCode(value) {
  if (value == null) return false
  const s = String(value).trim()
  return /^P\d+/i.test(s) || (Number.isNaN(Number(s)) && s.length > 0)
}

/**
 * Resolve the Flask backend numeric product id from a normalized or raw product object.
 * @param {object} product
 * @param {object[]} [catalog=[]] - normalized products from ProductContext
 */
export function resolveBackendProductId(product, catalog = []) {
  if (!product) return null

  if (isNumericProductId(product.backendId) && !looksLikeProductCode(product.backendId)) {
    return Number(product.backendId)
  }

  if (isNumericProductId(product.id) && !looksLikeProductCode(product.id)) {
    return Number(product.id)
  }

  const code = String(
    product.productCode || product.product_code || product.product_id || product.id || '',
  )
    .trim()

  if (code && catalog.length) {
    // Try exact match first
    const codeUpper = code.toUpperCase()
    const exactMatch = catalog.find(
      (p) =>
        String(p.id).toUpperCase() === codeUpper ||
        String(p.productCode || '').toUpperCase() === codeUpper,
    )
    if (exactMatch && isNumericProductId(exactMatch.backendId)) {
      return Number(exactMatch.backendId)
    }

    // Try normalized code variants (P0001 → p001, P0083 → p083)
    const numMatch = code.match(/[Pp](\d+)/)
    if (numMatch) {
      const num = parseInt(numMatch[1], 10)
      const variants = [
        `p${String(num).padStart(3, '0')}`,
        `p${String(num).padStart(4, '0')}`,
        `p${num}`,
      ]
      for (const variant of variants) {
        const variantUpper = variant.toUpperCase()
        const match = catalog.find(
          (p) =>
            String(p.id).toUpperCase() === variantUpper ||
            String(p.productCode || '').toUpperCase() === variantUpper,
        )
        if (match && isNumericProductId(match.backendId)) {
          return Number(match.backendId)
        }
      }
    }
  }

  return null
}

/** Async resolve — falls back to GET /api/products/:code when catalog lookup fails. */
export async function resolveBackendProductIdAsync(product, catalog = []) {
  const sync = resolveBackendProductId(product, catalog)
  if (sync) return sync

  const code = String(
    product?.productCode || product?.product_code || product?.product_id || product?.id || '',
  ).trim()

  if (!code || isNumericProductId(code)) return null

  // Try normalized code variants (handles P0001 vs p001 mismatch)
  const variants = generateCodeVariants(code)

  // First try catalog lookup with variants
  if (catalog.length) {
    for (const variant of variants) {
      const variantUpper = variant.toUpperCase()
      const match = catalog.find(
        (p) =>
          String(p.id).toUpperCase() === variantUpper ||
          String(p.productCode || '').toUpperCase() === variantUpper,
      )
      if (match && isNumericProductId(match.backendId)) {
        return Number(match.backendId)
      }
    }
  }

  // Then try fetching from backend with variants
  const { fetchProduct } = await import('@/services/productService')
  for (const variant of variants) {
    try {
      const fetched = await fetchProduct(variant)
      if (fetched?.backendId && isNumericProductId(fetched.backendId)) {
        return Number(fetched.backendId)
      }
    } catch {
      // continue to next variant
    }
  }

  return null
}

/** Generate code variants to handle format differences (P0001 vs p001 vs P001) */
function generateCodeVariants(code) {
  const variants = new Set([code, code.toUpperCase(), code.toLowerCase()])
  const numMatch = code.match(/[Pp](\d+)/)
  if (numMatch) {
    const num = parseInt(numMatch[1], 10)
    variants.add(`p${String(num).padStart(3, '0')}`)   // p001
    variants.add(`P${String(num).padStart(3, '0')}`)   // P001
    variants.add(`p${String(num).padStart(4, '0')}`)   // p0001
    variants.add(`P${String(num).padStart(4, '0')}`)   // P0001
    variants.add(`p${num}`)                            // p1
    variants.add(`P${num}`)                            // P1
  }
  return [...variants]
}

export function filterNearExpiry(products, within = 7) {
  const today = Date.now()
  return products.filter((p) => {
    if (!p.expiryDate) return false
    const diff = Math.ceil((new Date(p.expiryDate).getTime() - today) / (1000 * 60 * 60 * 24))
    return diff <= within && diff >= 0
  })
}
