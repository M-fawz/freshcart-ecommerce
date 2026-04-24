// Mock data matching the real API shapes from ecommerce.routemisr.com
// Used only when the real API is unreachable (development fallback)

export const MOCK_CATEGORIES = [
  { _id: 'cat1', name: 'Electronics',   image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300&q=80' },
  { _id: 'cat2', name: 'Clothes',       image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&q=80' },
  { _id: 'cat3', name: 'Food',          image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&q=80' },
  { _id: 'cat4', name: 'Books',         image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&q=80' },
  { _id: 'cat5', name: 'Sports',        image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=300&q=80' },
  { _id: 'cat6', name: 'Home & Living', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&q=80' },
  { _id: 'cat7', name: 'Beauty',        image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&q=80' },
  { _id: 'cat8', name: 'Toys',          image: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=300&q=80' },
]

export const MOCK_SUBCATEGORIES = {
  cat1: [{ _id: 'sub1a', name: 'Mobile Phones' }, { _id: 'sub1b', name: 'Laptops' }, { _id: 'sub1c', name: 'Tablets' }],
  cat2: [{ _id: 'sub2a', name: 'Men' },           { _id: 'sub2b', name: 'Women' },   { _id: 'sub2c', name: 'Kids' }],
  cat3: [{ _id: 'sub3a', name: 'Fresh Fruits' },  { _id: 'sub3b', name: 'Vegetables' }, { _id: 'sub3c', name: 'Dairy' }],
  cat4: [{ _id: 'sub4a', name: 'Fiction' },       { _id: 'sub4b', name: 'Non-Fiction' }],
  cat5: [{ _id: 'sub5a', name: 'Fitness' },       { _id: 'sub5b', name: 'Outdoor' }],
  cat6: [{ _id: 'sub6a', name: 'Kitchen' },       { _id: 'sub6b', name: 'Bedroom' }],
  cat7: [{ _id: 'sub7a', name: 'Skincare' },      { _id: 'sub7b', name: 'Makeup' }],
  cat8: [{ _id: 'sub8a', name: 'Action Figures' },{ _id: 'sub8b', name: 'Board Games' }],
}

const makeProducts = (n = 20) =>
  Array.from({ length: n }, (_, i) => ({
    _id:          `prod${i + 1}`,
    title:        `Premium Product ${i + 1} — High Quality Item`,
    slug:         `product-${i + 1}`,
    description:  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. A beautifully crafted product.',
    price:        Math.floor(Math.random() * 900 + 100),
    priceAfterDiscount: Math.random() > 0.5 ? Math.floor(Math.random() * 800 + 80) : undefined,
    ratingsAverage: +(Math.random() * 2 + 3).toFixed(1),
    ratingsQuantity: Math.floor(Math.random() * 200 + 5),
    quantity:     Math.floor(Math.random() * 50 + 10),
    sold:         Math.floor(Math.random() * 500),
    imageCover:   `https://images.unsplash.com/photo-${1500000000000 + i * 1000000}?w=400&q=80`,
    images:       [],
    category:     MOCK_CATEGORIES[i % MOCK_CATEGORIES.length],
    brand:        { _id: `brand${(i % 5) + 1}`, name: `Brand ${(i % 5) + 1}`, image: '' },
  }))

export const MOCK_PRODUCTS = makeProducts(32)

export const MOCK_BRANDS = [
  { _id: 'brand1', name: 'Apple',   image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=300&q=80' },
  { _id: 'brand2', name: 'Samsung', image: 'https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?w=300&q=80' },
  { _id: 'brand3', name: 'Nike',    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&q=80' },
  { _id: 'brand4', name: 'Adidas',  image: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=300&q=80' },
  { _id: 'brand5', name: 'Sony',    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&q=80' },
]
