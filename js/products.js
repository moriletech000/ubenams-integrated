// Product Database
const products = [
    {
        id: 1,
        name: 'Royal King',
        price: 650000,
        image: 'https://i.pinimg.com/736x/ae/b1/86/aeb186794c06290ecc80282100c7d4d9.jpg',
        category: 'Water Closet',
        brand: 'WC',
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
        subcategory: 'Utilities',
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
        subcategory: 'Utilities',
        name: 'Maxi 30L 2000W Water Heater',
        price: 35000,
        image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=500&h=500&fit=crop',
        category: 'Bathroom Accessories',
        brand: 'Maxi',
        description: 'Energy efficient water heater'
    },
    {
        id: 6,
        subcategory: 'Utilities',
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
        subcategory: 'Utilities',
        name: 'Bathroom Vanity Cabinet',
        price: 65000,
        image: 'https://images.unsplash.com/photo-1604709177225-055f99402ea3?w=500&h=500&fit=crop',
        category: 'Bathroom Accessories',
        brand: 'Hermitship Home',
        description: 'Elegant bathroom vanity cabinet'
    },
    {
        id: 9,
        name: 'Flower England Twyford with Free Stand Basin',
        price: 520000,
        image: 'https://i.pinimg.com/736x/99/5a/a7/995aa74a6685f78f4948443ca0256b40.jpg',
        category: 'Water Closet',
        brand: 'WC',
        description: 'Premium quality water closet'
    },
    {
        id: 10,
        subcategory: 'Utilities',
        name: 'Water Heater (10Ltr)',
        price: 22000,
        image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=500&h=500&fit=crop',
        category: 'Bathroom Accessories',
        brand: 'Sweet Home',
        description: 'Compact 10 liter water heater'
    },
    {
        id: 11,
        subcategory: 'Utilities',
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
        id: 14,
        subcategory: 'Utilities',
        name: 'Modern Round Freestanding Bath Shower (Anti-rust)',
        price: 95000,
        image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=500&h=500&fit=crop',
        category: 'Bathroom Accessories',
        brand: 'Milano',
        description: 'Anti-rust freestanding bath shower'
    },
    {
        id: 15,
        subcategory: 'Utilities',
        name: 'Modern Round Freestanding Bath Shower (Black)',
        price: 98000,
        image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=500&h=500&fit=crop',
        category: 'Bathroom Accessories',
        brand: 'Milano',
        description: 'Sleek black freestanding bath shower'
    },
    {
        id: 16,
        name: 'Guarantee Italy with Free Stand Basin',
        price: 520000,
        image: 'https://i.pinimg.com/736x/67/2a/48/672a48728933d8a16996379077f546e8.jpg',
        category: 'Water Closet',
        brand: 'WC',
        description: 'Water-saving dual flush mechanism with soft-close seat'
    },
    {
        id: 17,
        name: 'Lavida',
        price: 250000,
        image: 'https://i.pinimg.com/736x/61/2e/93/612e93a33b04ddc0a5d0674bcfc86e1c.jpg',
        category: 'Water Closet',
        brand: 'WC',
        description: 'Space-saving wall-mounted design with concealed cistern'
    },
    {
        id: 18,
        name: 'Jetmatis England',
        price: 220000,
        image: 'https://i.pinimg.com/736x/24/be/e5/24bee5c8d229836fcef176c6c21c07e3.jpg',
        category: 'Water Closet',
        brand: 'WC',
        description: 'Sleek one-piece design, easy to clean and maintain'
    },
    {
        id: 19,
        name: 'Close-Couple',
        price: 130000,
        image: 'https://i.pinimg.com/736x/6e/fa/61/6efa61cbe7bea9f4cf02b4f67ebdeee4.jpg',
        category: 'Water Closet',
        brand: 'WC',
        description: 'Classic close-coupled WC with efficient flushing system'
    },
    {
        id: 20,
        name: 'Guarantee Italy',
        price: 220000,
        image: 'https://i.pinimg.com/736x/b8/c5/7e/b8c57eed40567170e09fbf152c0cb718.jpg',
        category: 'Water Closet',
        brand: 'WC',
        description: 'Smart toilet with integrated bidet, heated seat, and auto flush'
    },
    {
        id: 21,
        name: 'Guarantee Italy',
        price: 700000,
        image: 'https://i.pinimg.com/736x/84/4d/b8/844db845e2bd2267ba779690e1850e8e.jpg',
        category: 'Water Closet',
        brand: 'WC',
        description: 'Modern back-to-wall design with hidden cistern'
    },
    {
        id: 22,
        name: 'Guarantee Italy with Suspended Basin',
        price: 380000,
        image: 'https://i.pinimg.com/736x/e0/ee/94/e0ee940ea97d58c5dd8bb18ba9ae8496.jpg',
        category: 'Water Closet',
        brand: 'WC',
        description: 'Space-efficient WC perfect for small bathrooms'
    },
    {
        id: 23,
        name: 'Guarantee Italy with Suspended Basin',
        price: 380000,
        image: 'https://i.pinimg.com/736x/74/0e/3b/740e3b574c83a22a3295925756b69f9b.jpg',
        category: 'Water Closet',
        brand: 'WC',
        description: 'Premium WC with elegant gold-plated fittings'
    },
    {
        id: 24,
        name: 'Guarantee Italy White',
        price: 260000,
        image: 'https://i.pinimg.com/736x/18/f1/b4/18f1b4cd35b229618df896d07706fcfe.jpg',
        category: 'Water Closet',
        brand: 'WC',
        description: 'Rimless design for superior hygiene and easy cleaning'
    },
    {
        id: 25,
        name: 'Guarantee Italy Black',
        price: 380000,
        image: 'https://i.pinimg.com/736x/40/43/fc/4043fc99369286591ef31279ae4da389.jpg',
        category: 'Water Closet',
        brand: 'WC',
        description: 'Eco-friendly low-flow WC that saves water with every flush'
    },
    {
        id: 26,
        name: 'Guarantee Italy Gold',
        price: 900000,
        image: 'https://i.pinimg.com/736x/b3/62/ff/b362ff6b318c42060875a4fa84d0f64e.jpg',
        category: 'Water Closet',
        brand: 'WC',
        description: 'Elegant matte black finish for contemporary bathrooms'
    },
    {
        id: 27,
        name: 'Guarantee Italy Black',
        price: 750000,
        image: 'https://i.pinimg.com/736x/4d/13/53/4d1353fd2e50b636c7545246d96d037b.jpg',
        category: 'Water Closet',
        brand: 'WC',
        description: 'Space-saving corner design for awkward bathroom layouts'
    },
    {
        id: 29,
        name: 'Guarantee Italy White',
        price: 700000,
        image: 'https://i.pinimg.com/736x/21/b6/63/21b6634c99e2b28ee5960810f248ee3f.jpg',
        category: 'Water Closet',
        brand: 'WC',
        description: 'Ultra-modern tankless design with direct water connection'
    },
    {
        id: 36,
        subcategory: 'Taps',
        name: 'Chrome Basin Mixer Tap',
        price: 15500,
        image: 'https://i.pinimg.com/736x/1e/35/c0/1e35c07c22eec256ce7942448f184b52.jpg',
        category: 'Bathroom Accessories',
        brand: 'Grohe',
        description: 'Premium chrome finish basin mixer with smooth operation'
    },
    {
        id: 37,
        subcategory: 'Taps',
        name: 'Wall-Mounted Bath Tap',
        price: 22000,
        image: 'https://i.pinimg.com/736x/b3/1e/3f/b31e3ff154d77f54ee6eb1c8feb81320.jpg',
        category: 'Bathroom Accessories',
        brand: 'Hansgrohe',
        description: 'Modern wall-mounted bath filler tap'
    },
    {
        id: 38,
        subcategory: 'Taps',
        name: 'Waterfall Basin Tap',
        price: 18000,
        image: 'https://i.pinimg.com/736x/32/c5/1c/32c51c25304a64cf9d2895ca34b7f7a9.jpg',
        category: 'Bathroom Accessories',
        brand: 'RAK',
        description: 'Elegant waterfall spout for modern bathrooms'
    },
    {
        id: 39,
        subcategory: 'Taps',
        name: 'Dual Handle Shower Mixer',
        price: 24500,
        image: 'https://i.pinimg.com/736x/13/9b/fc/139bfcc3c68444b72d3bebb9fd983925.jpg',
        category: 'Bathroom Accessories',
        brand: 'Kohler',
        description: 'Thermostatic shower mixer with dual controls'
    },
    {
        id: 40,
        subcategory: 'Taps',
        name: 'Single Lever Basin Tap',
        price: 12000,
        image: 'https://i.pinimg.com/736x/19/0f/49/190f49ec520918d39c6e6ac3f2854f61.jpg',
        category: 'Bathroom Accessories',
        brand: 'Ideal Standard',
        description: 'Sleek single lever design for easy temperature control'
    },
    {
        id: 41,
        subcategory: 'Taps',
        name: 'Gold-Plated Basin Tap',
        price: 35000,
        image: 'https://i.pinimg.com/736x/82/bd/51/82bd516442977bb90cb8edefc7e02894.jpg',
        category: 'Bathroom Accessories',
        brand: 'Villeroy & Boch',
        description: 'Luxurious gold-plated finish for premium bathrooms'
    },
    {
        id: 42,
        subcategory: 'Taps',
        name: 'Matte Black Basin Tap',
        price: 28000,
        image: 'https://i.pinimg.com/736x/bd/02/48/bd02482fd549d94bd55e563676ed7151.jpg',
        category: 'Bathroom Accessories',
        brand: 'Roca',
        description: 'Contemporary matte black finish basin mixer'
    },
    {
        id: 43,
        subcategory: 'Taps',
        name: 'Tall Basin Tap',
        price: 19500,
        image: 'https://i.pinimg.com/736x/2c/61/c2/2c61c2636cd20898d5886c23f4fa3bdb.jpg',
        category: 'Bathroom Accessories',
        brand: 'Duravit',
        description: 'High-rise tap perfect for countertop basins'
    },
    {
        id: 44,
        subcategory: 'Taps',
        name: 'Sensor Basin Tap (Touchless)',
        price: 42000,
        image: 'https://i.pinimg.com/736x/2c/e7/5a/2ce75a75c50429e20d7b5b76aaaab028.jpg',
        category: 'Bathroom Accessories',
        brand: 'Toto',
        description: 'Automatic sensor tap for hygienic hands-free operation'
    },
    {
        id: 45,
        subcategory: 'Taps',
        name: 'Pull-Out Bidet Tap',
        price: 26000,
        image: 'https://i.pinimg.com/736x/8c/b5/e8/8cb5e8ee4a7149bc67c4d47eba7c29b4.jpg',
        category: 'Bathroom Accessories',
        brand: 'American Standard',
        description: 'Versatile pull-out spray head for bidet function'
    },
    {
        id: 46,
        subcategory: 'Connectors',
        name: 'Flexible Hose Connector (60cm)',
        price: 2500,
        image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=500&h=500&fit=crop',
        category: 'Bathroom Accessories',
        brand: 'Universal',
        description: 'Stainless steel braided flexible connector'
    },
    {
        id: 47,
        subcategory: 'Connectors',
        name: 'Basin Waste Connector',
        price: 1800,
        image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=500&h=500&fit=crop',
        category: 'Bathroom Accessories',
        brand: 'McAlpine',
        description: 'Chrome plated basin waste with pop-up mechanism'
    },
    {
        id: 48,
        subcategory: 'Connectors',
        name: 'Shower Hose (150cm)',
        price: 3200,
        image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=500&h=500&fit=crop',
        category: 'Bathroom Accessories',
        brand: 'Grohe',
        description: 'Anti-twist shower hose with chrome finish'
    },
    {
        id: 49,
        subcategory: 'Connectors',
        name: 'Water Supply Connector Kit',
        price: 4500,
        image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=500&h=500&fit=crop',
        category: 'Bathroom Accessories',
        brand: 'Plumbsure',
        description: 'Complete connector kit for tap installation'
    },
    {
        id: 50,
        subcategory: 'Connectors',
        name: 'Bath Overflow Connector',
        price: 2800,
        image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=500&h=500&fit=crop',
        category: 'Bathroom Accessories',
        brand: 'Wirquin',
        description: 'Chrome bath overflow and waste connector'
    },
    {
        id: 51,
        subcategory: 'Buttocks Wash',
        name: 'Handheld Bidet Spray',
        price: 8500,
        image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=500&h=500&fit=crop',
        category: 'Bathroom Accessories',
        brand: 'SmarterFresh',
        description: 'Chrome plated handheld bidet spray with holder'
    },
    {
        id: 52,
        subcategory: 'Buttocks Wash',
        name: 'Wall-Mounted Bidet Jet',
        price: 12000,
        image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=500&h=500&fit=crop',
        category: 'Bathroom Accessories',
        brand: 'Brondell',
        description: 'Adjustable pressure bidet jet with temperature control'
    },
    {
        id: 53,
        subcategory: 'Buttocks Wash',
        name: 'Bidet Attachment (Non-Electric)',
        price: 15500,
        image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=500&h=500&fit=crop',
        category: 'Bathroom Accessories',
        brand: 'Luxe Bidet',
        description: 'Easy-install bidet attachment for existing toilets'
    },
    {
        id: 54,
        subcategory: 'Buttocks Wash',
        name: 'Premium Bidet Spray Set',
        price: 18000,
        image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=500&h=500&fit=crop',
        category: 'Bathroom Accessories',
        brand: 'Kohler',
        description: 'Complete bidet spray set with stainless steel hose'
    },
    {
        id: 55,
        subcategory: 'Buttocks Wash',
        name: 'Brass Bidet Shattaf',
        price: 9500,
        image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=500&h=500&fit=crop',
        category: 'Bathroom Accessories',
        brand: 'Shattaf',
        description: 'Durable brass construction Muslim shower'
    },
    // Showers
    {
        id: 56,
        name: 'Rainfall Shower Head',
        price: 45000,
        image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=500&h=500&fit=crop',
        category: 'Showers',
        brand: 'Luxury',
        description: 'Premium rainfall shower head with chrome finish'
    },
    {
        id: 57,
        name: 'Shower Panel System',
        price: 85000,
        image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=500&h=500&fit=crop',
        category: 'Showers',
        brand: 'Elite',
        description: 'Complete shower panel with multiple spray options'
    },
    {
        id: 58,
        name: 'Handheld Shower Set',
        price: 28000,
        image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=500&h=500&fit=crop',
        category: 'Showers',
        brand: 'Standard',
        description: 'Adjustable handheld shower with flexible hose'
    },
    // Doors
    {
        id: 59,
        name: 'Glass Shower Door',
        price: 120000,
        image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&h=500&fit=crop',
        category: 'Door',
        brand: 'Premium',
        description: 'Tempered glass shower door with chrome frame'
    },
    {
        id: 60,
        name: 'Bathroom Entry Door',
        price: 95000,
        image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&h=500&fit=crop',
        category: 'Door',
        brand: 'Standard',
        description: 'Waterproof bathroom entry door'
    },
    {
        id: 61,
        name: 'Sliding Glass Door',
        price: 150000,
        image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&h=500&fit=crop',
        category: 'Door',
        brand: 'Modern',
        description: 'Space-saving sliding glass door for bathroom'
    },
    // Mirrors
    {
        id: 62,
        name: 'LED Bathroom Mirror',
        price: 55000,
        image: 'https://images.unsplash.com/photo-1618220924273-338d82f0e1c9?w=500&h=500&fit=crop',
        category: 'Mirror',
        brand: 'Smart',
        description: 'LED illuminated bathroom mirror with defogger'
    },
    {
        id: 63,
        name: 'Wall-Mounted Mirror',
        price: 32000,
        image: 'https://images.unsplash.com/photo-1618220924273-338d82f0e1c9?w=500&h=500&fit=crop',
        category: 'Mirror',
        brand: 'Classic',
        description: 'Elegant wall-mounted bathroom mirror'
    },
    {
        id: 64,
        name: 'Cabinet Mirror',
        price: 68000,
        image: 'https://images.unsplash.com/photo-1618220924273-338d82f0e1c9?w=500&h=500&fit=crop',
        category: 'Mirror',
        brand: 'Storage',
        description: 'Mirror cabinet with built-in storage'
    },
    // Home Deco
    {
        id: 65,
        name: 'Decorative Towel Rack',
        price: 18000,
        image: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=500&h=500&fit=crop',
        category: 'Home Deco',
        brand: 'Deco',
        description: 'Stylish towel rack for bathroom decoration'
    },
    {
        id: 66,
        name: 'Bathroom Accessories Set',
        price: 35000,
        image: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=500&h=500&fit=crop',
        category: 'Home Deco',
        brand: 'Deco',
        description: 'Complete bathroom accessories set with holder'
    },
    {
        id: 67,
        name: 'Wall Art Decor',
        price: 22000,
        image: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=500&h=500&fit=crop',
        category: 'Home Deco',
        brand: 'Art',
        description: 'Modern wall art for home decoration'
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

// Get subcategories for a given category
function getSubcategories(category) {
    const categoryProducts = products.filter(p => p.category === category);
    const subcategories = [...new Set(categoryProducts.map(p => p.subcategory).filter(Boolean))];
    return subcategories.sort();
}

// Get products by category and optional subcategory
function getProductsByCategory(category, subcategory = null) {
    if (category === 'All') return products;
    
    let filtered = products.filter(p => p.category === category);
    
    if (subcategory) {
        filtered = filtered.filter(p => p.subcategory === subcategory);
    }
    
    return filtered;
}
