// Product Database
const products = [
    {
        id: 1,
        name: 'Royal W.C',
        price: 45000,
        image: 'https://i.pinimg.com/736x/ae/b1/86/aeb186794c06290ecc80282100c7d4d9.jpg',
        category: 'Water Closet',
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
        category: 'Bathroom Accessories',
        brand: 'Brimix',
        description: 'Modern black shower set'
    },
    {
        id: 4,
        name: '4-Burner Stainless Steel Gas Hob',
        price: 55000,
        image: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=500&h=500&fit=crop',
        category: 'Kitchen Accessories',
        brand: 'Nesta',
        description: 'Durable stainless steel gas hob'
    },
    {
        id: 5,
        name: 'Maxi 30L 2000W Water Heater',
        price: 35000,
        image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=500&h=500&fit=crop',
        category: 'Bathroom Accessories',
        brand: 'Maxi',
        description: 'Energy efficient water heater'
    },
    {
        id: 6,
        name: '90 x 90 Shower Cubicle',
        price: 85000,
        image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&h=500&fit=crop',
        category: 'Bathroom Accessories',
        brand: 'Cubicle',
        description: 'Spacious shower cubicle'
    },
    {
        id: 7,
        name: 'Kitchen Sink Tap',
        price: 8500,
        image: 'https://images.unsplash.com/photo-1585159812596-fac104f2f069?w=500&h=500&fit=crop',
        category: 'Kitchen Accessories',
        brand: 'Faucet',
        description: 'Modern kitchen sink tap'
    },
    {
        id: 8,
        name: 'Bathroom Vanity Cabinet',
        price: 65000,
        image: 'https://images.unsplash.com/photo-1604709177225-055f99402ea3?w=500&h=500&fit=crop',
        category: 'Bathroom Accessories',
        brand: 'Hermitship Home',
        description: 'Elegant bathroom vanity cabinet'
    },
    {
        id: 9,
        name: 'Micoe Top Flush Water Closet',
        price: 48000,
        image: 'https://i.pinimg.com/736x/99/5a/a7/995aa74a6685f78f4948443ca0256b40.jpg',
        category: 'Water Closet',
        brand: 'Vstar',
        description: 'Premium quality water closet'
    },
    {
        id: 10,
        name: 'Water Heater (10Ltr)',
        price: 22000,
        image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=500&h=500&fit=crop',
        category: 'Bathroom Accessories',
        brand: 'Sweet Home',
        description: 'Compact 10 liter water heater'
    },
    {
        id: 11,
        name: 'Smart LED Mirror',
        price: 42000,
        image: 'https://images.unsplash.com/photo-1618220924273-338d82f0e1c9?w=500&h=500&fit=crop',
        category: 'Bathroom Accessories',
        brand: 'BTZHY',
        description: 'Modern LED bathroom mirror'
    },
    {
        id: 12,
        name: 'Kitchen Long Neck Tap',
        price: 12500,
        image: 'https://images.unsplash.com/photo-1585159812596-fac104f2f069?w=500&h=500&fit=crop',
        category: 'Kitchen Accessories',
        brand: 'Choice',
        description: 'Long neck kitchen tap'
    },
    {
        id: 13,
        name: 'White And Gold Coloured Wash Hand Basin',
        price: 28000,
        image: 'https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?w=500&h=500&fit=crop',
        category: 'Bathroom Accessories',
        brand: 'TNG',
        description: 'Elegant wash hand basin'
    },
    {
        id: 14,
        name: 'Modern Round Freestanding Bath Shower (Anti-rust)',
        price: 95000,
        image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=500&h=500&fit=crop',
        category: 'Bathroom Accessories',
        brand: 'Milano',
        description: 'Anti-rust freestanding bath shower'
    },
    {
        id: 15,
        name: 'Modern Round Freestanding Bath Shower (Black)',
        price: 98000,
        image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=500&h=500&fit=crop',
        category: 'Bathroom Accessories',
        brand: 'Milano',
        description: 'Sleek black freestanding bath shower'
    },
    {
        id: 16,
        name: 'Dual Flush Water Closet (White)',
        price: 52000,
        image: 'https://i.pinimg.com/736x/67/2a/48/672a48728933d8a16996379077f546e8.jpg',
        category: 'Water Closet',
        brand: 'Kohler',
        description: 'Water-saving dual flush mechanism with soft-close seat'
    },
    {
        id: 17,
        name: 'Wall-Hung Water Closet',
        price: 68000,
        image: 'https://i.pinimg.com/736x/61/2e/93/612e93a33b04ddc0a5d0674bcfc86e1c.jpg',
        category: 'Water Closet',
        brand: 'American Standard',
        description: 'Space-saving wall-mounted design with concealed cistern'
    },
    {
        id: 18,
        name: 'One-Piece Water Closet (Ceramic)',
        price: 72000,
        image: 'https://i.pinimg.com/736x/24/be/e5/24bee5c8d229836fcef176c6c21c07e3.jpg',
        category: 'Water Closet',
        brand: 'Toto',
        description: 'Sleek one-piece design, easy to clean and maintain'
    },
    {
        id: 19,
        name: 'Close-Coupled Water Closet',
        price: 42000,
        image: 'https://i.pinimg.com/736x/6e/fa/61/6efa61cbe7bea9f4cf02b4f67ebdeee4.jpg',
        category: 'Water Closet',
        brand: 'Ideal Standard',
        description: 'Classic close-coupled WC with efficient flushing system'
    },
    {
        id: 20,
        name: 'Smart Water Closet (Bidet Function)',
        price: 125000,
        image: 'https://i.pinimg.com/736x/b8/c5/7e/b8c57eed40567170e09fbf152c0cb718.jpg',
        category: 'Water Closet',
        brand: 'Roca',
        description: 'Smart toilet with integrated bidet, heated seat, and auto flush'
    },
    {
        id: 21,
        name: 'Back-to-Wall Water Closet',
        price: 55000,
        image: 'https://i.pinimg.com/736x/84/4d/b8/844db845e2bd2267ba779690e1850e8e.jpg',
        category: 'Water Closet',
        brand: 'Duravit',
        description: 'Modern back-to-wall design with hidden cistern'
    },
    {
        id: 22,
        name: 'Compact Water Closet (Small Bathrooms)',
        price: 38000,
        image: 'https://i.pinimg.com/736x/e0/ee/94/e0ee940ea97d58c5dd8bb18ba9ae8496.jpg',
        category: 'Water Closet',
        brand: 'Cera',
        description: 'Space-efficient WC perfect for small bathrooms'
    },
    {
        id: 23,
        name: 'Luxury Water Closet (Gold Accents)',
        price: 95000,
        image: 'https://i.pinimg.com/736x/74/0e/3b/740e3b574c83a22a3295925756b69f9b.jpg',
        category: 'Water Closet',
        brand: 'Villeroy & Boch',
        description: 'Premium WC with elegant gold-plated fittings'
    },
    {
        id: 24,
        name: 'Rimless Water Closet (Hygienic)',
        price: 64000,
        image: 'https://i.pinimg.com/736x/18/f1/b4/18f1b4cd35b229618df896d07706fcfe.jpg',
        category: 'Water Closet',
        brand: 'Grohe',
        description: 'Rimless design for superior hygiene and easy cleaning'
    },
    {
        id: 25,
        name: 'Eco-Friendly Water Closet (Low Flow)',
        price: 49000,
        image: 'https://i.pinimg.com/736x/40/43/fc/4043fc99369286591ef31279ae4da389.jpg',
        category: 'Water Closet',
        brand: 'Jaquar',
        description: 'Eco-friendly low-flow WC that saves water with every flush'
    },
    {
        id: 26,
        name: 'Designer Water Closet (Matte Black)',
        price: 88000,
        image: 'https://i.pinimg.com/736x/b3/62/ff/b362ff6b318c42060875a4fa84d0f64e.jpg',
        category: 'Water Closet',
        brand: 'Hansgrohe',
        description: 'Elegant matte black finish for contemporary bathrooms'
    },
    {
        id: 27,
        name: 'Corner Water Closet',
        price: 46000,
        image: 'https://i.pinimg.com/736x/4d/13/53/4d1353fd2e50b636c7545246d96d037b.jpg',
        category: 'Water Closet',
        brand: 'Saniflo',
        description: 'Space-saving corner design for awkward bathroom layouts'
    },
    {
        id: 28,
        name: 'High-Level Water Closet (Victorian Style)',
        price: 75000,
        image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=500&h=500&fit=crop',
        category: 'Water Closet',
        brand: 'Heritage',
        description: 'Classic Victorian-style high-level cistern WC'
    },
    {
        id: 29,
        name: 'Tankless Water Closet (Modern)',
        price: 82000,
        image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=500&h=500&fit=crop',
        category: 'Water Closet',
        brand: 'Geberit',
        description: 'Ultra-modern tankless design with direct water connection'
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
