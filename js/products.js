// Product Database
const products = [
    {
        id: 1,
        name: 'Vatti Top Flush Water Closet',
        price: 45000,
        image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=500&h=500&fit=crop',
        category: 'Sanitary',
        brand: 'Vstar',
        description: 'High-quality top flush water closet'
    },
    {
        id: 2,
        name: '40 x 40 Glaze Tiles',
        price: 2500,
        image: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=500&h=500&fit=crop',
        category: 'Tiles',
        brand: 'Virony',
        description: 'Premium quality glazed tiles'
    },
    {
        id: 3,
        name: 'Shower Set (Black)',
        price: 18500,
        image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=500&h=500&fit=crop',
        category: 'Bathroom',
        brand: 'Brimix',
        description: 'Modern black shower set'
    },
    {
        id: 4,
        name: '4-Burner Stainless Steel Gas Hob',
        price: 55000,
        image: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=500&h=500&fit=crop',
        category: 'Kitchen',
        brand: 'Nesta',
        description: 'Durable stainless steel gas hob'
    },
    {
        id: 5,
        name: 'Maxi 30L 2000W Water Heater',
        price: 35000,
        image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=500&h=500&fit=crop',
        category: 'Bathroom',
        brand: 'Maxi',
        description: 'Energy efficient water heater'
    },
    {
        id: 6,
        name: '90 x 90 Shower Cubicle',
        price: 85000,
        image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&h=500&fit=crop',
        category: 'Bathroom',
        brand: 'Cubicle',
        description: 'Spacious shower cubicle'
    },
    {
        id: 7,
        name: 'Kitchen Sink Tap',
        price: 8500,
        image: 'https://images.unsplash.com/photo-1585159812596-fac104f2f069?w=500&h=500&fit=crop',
        category: 'Kitchen',
        brand: 'Faucet',
        description: 'Modern kitchen sink tap'
    },
    {
        id: 8,
        name: 'Bathroom Vanity Cabinet',
        price: 65000,
        image: 'https://images.unsplash.com/photo-1604709177225-055f99402ea3?w=500&h=500&fit=crop',
        category: 'Bathroom',
        brand: 'Hermitship Home',
        description: 'Elegant bathroom vanity cabinet'
    },
    {
        id: 9,
        name: 'Micoe Top Flush Water Closet',
        price: 48000,
        image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=500&h=500&fit=crop',
        category: 'Sanitary',
        brand: 'Vstar',
        description: 'Premium quality water closet'
    },
    {
        id: 10,
        name: 'Water Heater (10Ltr)',
        price: 22000,
        image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=500&h=500&fit=crop',
        category: 'Bathroom',
        brand: 'Sweet Home',
        description: 'Compact 10 liter water heater'
    },
    {
        id: 11,
        name: 'Smart LED Mirror',
        price: 42000,
        image: 'https://images.unsplash.com/photo-1618220924273-338d82f0e1c9?w=500&h=500&fit=crop',
        category: 'Bathroom',
        brand: 'BTZHY',
        description: 'Modern LED bathroom mirror'
    },
    {
        id: 12,
        name: 'Kitchen Long Neck Tap',
        price: 12500,
        image: 'https://images.unsplash.com/photo-1585159812596-fac104f2f069?w=500&h=500&fit=crop',
        category: 'Kitchen',
        brand: 'Choice',
        description: 'Long neck kitchen tap'
    },
    {
        id: 13,
        name: 'White And Gold Coloured Wash Hand Basin',
        price: 28000,
        image: 'https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?w=500&h=500&fit=crop',
        category: 'Bathroom',
        brand: 'TNG',
        description: 'Elegant wash hand basin'
    },
    {
        id: 14,
        name: 'Modern Round Freestanding Bath Shower (Anti-rust)',
        price: 95000,
        image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=500&h=500&fit=crop',
        category: 'Bathroom',
        brand: 'Milano',
        description: 'Anti-rust freestanding bath shower'
    },
    {
        id: 15,
        name: 'Modern Round Freestanding Bath Shower (Black)',
        price: 98000,
        image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=500&h=500&fit=crop',
        category: 'Bathroom',
        brand: 'Milano',
        description: 'Sleek black freestanding bath shower'
    }
];

// Format price to Nigerian Naira
function formatPrice(price) {
    return '₦' + price.toLocaleString('en-NG');
}

// Create product card HTML
function createProductCard(product) {
    return `
        <div class="product-card" onclick="viewProduct(${product.id})">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/500x500?text=Product+Image'">
            </div>
            <div class="product-info">
                <div class="product-brand">${product.brand}</div>
                <h5 class="product-name">${product.name}</h5>
                <div class="product-footer">
                    <span class="product-price">${formatPrice(product.price)}</span>
                    <button class="add-to-cart-btn" onclick="event.stopPropagation(); addToCart(${product.id})">
                        <i class="fas fa-shopping-cart"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Get product by ID
function getProductById(id) {
    return products.find(p => p.id === id);
}

// View product details
function viewProduct(id) {
    localStorage.setItem('selectedProduct', id);
    window.location.href = 'product.html';
}

// Get all categories
function getCategories() {
    return ['All', ...new Set(products.map(p => p.category))];
}
