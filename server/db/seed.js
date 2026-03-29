const db = require('./database');

function seed() {
  console.log('🌱 Starting seed...');

  // Clear existing data
  db.exec(`
    DELETE FROM reviews;
    DELETE FROM cart;
    DELETE FROM wishlist;
    DELETE FROM orders;
    DELETE FROM products;
    DELETE FROM categories;
    DELETE FROM users;
  `);

  // Seed categories
  const categoryInsert = db.prepare(`
    INSERT INTO categories (name, slug, image_url) VALUES (?, ?, ?)
  `);

  const categories = [
    { name: 'Women', slug: 'women', image_url: 'https://picsum.photos/seed/women-cat/300/400' },
    { name: 'Men', slug: 'men', image_url: 'https://picsum.photos/seed/men-cat/300/400' },
    { name: 'Kids', slug: 'kids', image_url: 'https://picsum.photos/seed/kids-cat/300/400' },
    { name: 'Beauty', slug: 'beauty', image_url: 'https://picsum.photos/seed/beauty-cat/300/400' },
    { name: 'Footwear', slug: 'footwear', image_url: 'https://picsum.photos/seed/footwear-cat/300/400' },
  ];

  const categoryIds = {};
  for (const cat of categories) {
    const result = categoryInsert.run(cat.name, cat.slug, cat.image_url);
    categoryIds[cat.slug] = result.lastInsertRowid;
  }

  console.log('✅ Categories seeded');

  // Seed products
  const productInsert = db.prepare(`
    INSERT INTO products (name, brand, description, price, mrp, category_id, subcategory, gender, sizes, colors, images, rating, review_count, stock, is_featured, tags)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const products = [
    // WOMEN - Kurtas
    {
      name: 'Libas Women Floral Print Straight Kurta',
      brand: 'Libas',
      description: 'Beautiful floral print straight kurta crafted from soft cotton fabric. Perfect for casual and semi-formal occasions. Features a comfortable A-line silhouette with intricate floral detailing.',
      price: 699, mrp: 1299,
      category: 'women', subcategory: 'Kurtas', gender: 'Women',
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Blue', 'Pink', 'Yellow'],
      images: ['https://picsum.photos/seed/kurta1a/400/500', 'https://picsum.photos/seed/kurta1b/400/500', 'https://picsum.photos/seed/kurta1c/400/500'],
      rating: 4.3, review_count: 842, stock: 150, is_featured: 1,
      tags: ['trending', 'ethnic']
    },
    {
      name: 'W Women Ethnic Motifs Printed Kurta',
      brand: 'W',
      description: 'Elegant ethnic motifs printed kurta with a modern twist. Made from breathable rayon fabric with a graceful flared hem. Ideal for festive occasions and office wear.',
      price: 999, mrp: 1799,
      category: 'women', subcategory: 'Kurtas', gender: 'Women',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Red', 'Teal', 'Purple'],
      images: ['https://picsum.photos/seed/kurta2a/400/500', 'https://picsum.photos/seed/kurta2b/400/500'],
      rating: 4.5, review_count: 1203, stock: 200, is_featured: 1,
      tags: ['new', 'bestseller']
    },
    {
      name: 'Biba Women Embroidered Anarkali Kurta',
      brand: 'Biba',
      description: 'Exquisite embroidered Anarkali kurta that blends tradition with contemporary style. Features intricate mirror work and beautiful embroidery on pure cotton fabric.',
      price: 1499, mrp: 2999,
      category: 'women', subcategory: 'Kurtas', gender: 'Women',
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Maroon', 'Navy', 'Green'],
      images: ['https://picsum.photos/seed/kurta3a/400/500', 'https://picsum.photos/seed/kurta3b/400/500'],
      rating: 4.6, review_count: 567, stock: 80, is_featured: 0,
      tags: ['festive', 'premium']
    },
    {
      name: 'Aurelia Women Striped Straight Kurta',
      brand: 'Aurelia',
      description: 'Contemporary striped straight kurta with a modern silhouette. Crafted from premium viscose fabric with subtle geometric patterns.',
      price: 849, mrp: 1499,
      category: 'women', subcategory: 'Kurtas', gender: 'Women',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['White', 'Peach', 'Mint'],
      images: ['https://picsum.photos/seed/kurta4a/400/500', 'https://picsum.photos/seed/kurta4b/400/500'],
      rating: 4.1, review_count: 329, stock: 120, is_featured: 0,
      tags: ['casual', 'office']
    },
    // WOMEN - Dresses
    {
      name: 'Roadster Women Flared Midi Dress',
      brand: 'Roadster',
      description: 'Trendy flared midi dress with a flattering silhouette. Made from soft crepe fabric with a delicate floral print. Features a smocked waistband for a perfect fit.',
      price: 1199, mrp: 2199,
      category: 'women', subcategory: 'Dresses', gender: 'Women',
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Dusty Rose', 'Sage Green', 'Lavender'],
      images: ['https://picsum.photos/seed/dress1a/400/500', 'https://picsum.photos/seed/dress1b/400/500'],
      rating: 4.4, review_count: 678, stock: 90, is_featured: 1,
      tags: ['trending', 'new']
    },
    {
      name: 'Fabindia Women Block Print Wrap Dress',
      brand: 'Fabindia',
      description: 'Handcrafted block print wrap dress in natural cotton. Each piece is unique with artisan hand-block printing techniques from Rajasthan.',
      price: 1799, mrp: 2999,
      category: 'women', subcategory: 'Dresses', gender: 'Women',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Indigo', 'Rust', 'Olive'],
      images: ['https://picsum.photos/seed/dress2a/400/500', 'https://picsum.photos/seed/dress2b/400/500'],
      rating: 4.7, review_count: 412, stock: 60, is_featured: 0,
      tags: ['handcrafted', 'premium']
    },
    {
      name: 'Roadster Strappy Bodycon Dress',
      brand: 'Roadster',
      description: 'Chic strappy bodycon dress perfect for evenings out. Made from stretchy jersey fabric that hugs your curves. Features adjustable spaghetti straps.',
      price: 799, mrp: 1499,
      category: 'women', subcategory: 'Dresses', gender: 'Women',
      sizes: ['XS', 'S', 'M', 'L'],
      colors: ['Black', 'Red', 'Cobalt Blue'],
      images: ['https://picsum.photos/seed/dress3a/400/500', 'https://picsum.photos/seed/dress3b/400/500'],
      rating: 4.2, review_count: 891, stock: 110, is_featured: 0,
      tags: ['party', 'trending']
    },
    // WOMEN - Tops
    {
      name: 'Roadster Women Solid Crop Top',
      brand: 'Roadster',
      description: 'Minimalist solid crop top in premium cotton blend. The perfect wardrobe staple that pairs with everything from jeans to skirts.',
      price: 399, mrp: 699,
      category: 'women', subcategory: 'Tops', gender: 'Women',
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['White', 'Black', 'Beige', 'Pink'],
      images: ['https://picsum.photos/seed/top1a/400/500', 'https://picsum.photos/seed/top1b/400/500'],
      rating: 4.0, review_count: 1567, stock: 250, is_featured: 0,
      tags: ['casual', 'basic']
    },
    {
      name: 'W Women Embroidered Peplum Top',
      brand: 'W',
      description: 'Elegant peplum top with beautiful thread embroidery on the neckline and hemline. Crafted from soft georgette fabric.',
      price: 899, mrp: 1599,
      category: 'women', subcategory: 'Tops', gender: 'Women',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Coral', 'Mint', 'Mustard'],
      images: ['https://picsum.photos/seed/top2a/400/500', 'https://picsum.photos/seed/top2b/400/500'],
      rating: 4.3, review_count: 234, stock: 80, is_featured: 0,
      tags: ['office', 'semi-formal']
    },
    // WOMEN - Jeans
    {
      name: 'Roadster Women High-Rise Skinny Jeans',
      brand: 'Roadster',
      description: 'Classic high-rise skinny jeans with a flattering fit. Made from premium denim with 2% elastane for stretch and comfort. Features a 5-pocket design.',
      price: 1299, mrp: 2499,
      category: 'women', subcategory: 'Jeans', gender: 'Women',
      sizes: ['26', '28', '30', '32', '34'],
      colors: ['Blue', 'Black', 'Grey'],
      images: ['https://picsum.photos/seed/wjeans1a/400/500', 'https://picsum.photos/seed/wjeans1b/400/500'],
      rating: 4.4, review_count: 2143, stock: 180, is_featured: 0,
      tags: ['denim', 'bestseller']
    },
    // WOMEN - Ethnic Wear
    {
      name: 'Biba Women Embellished Sharara Set',
      brand: 'Biba',
      description: 'Stunning embellished sharara set with intricate zari work. Includes a flowy kurta and wide-leg sharara pants. Perfect for weddings and festive celebrations.',
      price: 2999, mrp: 5499,
      category: 'women', subcategory: 'Ethnic Wear', gender: 'Women',
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Golden', 'Rose Gold', 'Silver'],
      images: ['https://picsum.photos/seed/ethnic1a/400/500', 'https://picsum.photos/seed/ethnic1b/400/500'],
      rating: 4.8, review_count: 189, stock: 40, is_featured: 1,
      tags: ['festive', 'wedding', 'premium']
    },
    // WOMEN - Sarees
    {
      name: 'Fabindia Women Handloom Silk Saree',
      brand: 'Fabindia',
      description: 'Exquisite handloom silk saree woven by master artisans. Features a rich zari border and intricate motifs. Comes with a matching blouse piece.',
      price: 3999, mrp: 6999,
      category: 'women', subcategory: 'Sarees', gender: 'Women',
      sizes: ['Free Size'],
      colors: ['Cream', 'Pink', 'Red'],
      images: ['https://picsum.photos/seed/saree1a/400/500', 'https://picsum.photos/seed/saree1b/400/500'],
      rating: 4.9, review_count: 312, stock: 30, is_featured: 1,
      tags: ['handloom', 'silk', 'premium']
    },
    // MEN - T-Shirts
    {
      name: 'HRX Men Rapid-Dry Solid T-shirt',
      brand: 'HRX',
      description: 'Performance-ready rapid-dry t-shirt engineered for active lifestyles. Made from moisture-wicking fabric that keeps you cool during intense workouts.',
      price: 499, mrp: 999,
      category: 'men', subcategory: 'T-Shirts', gender: 'Men',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Black', 'Navy', 'Red', 'White'],
      images: ['https://picsum.photos/seed/mtshirt1a/400/500', 'https://picsum.photos/seed/mtshirt1b/400/500'],
      rating: 4.2, review_count: 3421, stock: 300, is_featured: 1,
      tags: ['sports', 'trending', 'bestseller']
    },
    {
      name: 'Roadster Men Oversized Graphic T-shirt',
      brand: 'Roadster',
      description: 'Statement oversized graphic t-shirt with bold artistic print. Crafted from 100% cotton for maximum breathability and comfort.',
      price: 599, mrp: 999,
      category: 'men', subcategory: 'T-Shirts', gender: 'Men',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['White', 'Black', 'Olive'],
      images: ['https://picsum.photos/seed/mtshirt2a/400/500', 'https://picsum.photos/seed/mtshirt2b/400/500'],
      rating: 4.1, review_count: 876, stock: 200, is_featured: 0,
      tags: ['casual', 'streetwear']
    },
    {
      name: 'Allen Solly Men Polo T-shirt',
      brand: 'Allen Solly',
      description: 'Classic polo t-shirt in premium pique cotton. Features a 3-button placket and ribbed collar and cuffs. Perfect for business casual occasions.',
      price: 799, mrp: 1499,
      category: 'men', subcategory: 'T-Shirts', gender: 'Men',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['White', 'Navy', 'Grey', 'Burgundy'],
      images: ['https://picsum.photos/seed/mtshirt3a/400/500', 'https://picsum.photos/seed/mtshirt3b/400/500'],
      rating: 4.5, review_count: 654, stock: 160, is_featured: 0,
      tags: ['office', 'semi-formal']
    },
    // MEN - Shirts
    {
      name: 'Van Heusen Men Slim Fit Formal Shirt',
      brand: 'Van Heusen',
      description: 'Premium slim fit formal shirt crafted from wrinkle-resistant fabric. Features a spread collar and barrel cuffs. Perfect for office and formal occasions.',
      price: 999, mrp: 1999,
      category: 'men', subcategory: 'Shirts', gender: 'Men',
      sizes: ['38', '40', '42', '44', '46'],
      colors: ['White', 'Light Blue', 'Light Grey'],
      images: ['https://picsum.photos/seed/mshirt1a/400/500', 'https://picsum.photos/seed/mshirt1b/400/500'],
      rating: 4.6, review_count: 1892, stock: 140, is_featured: 1,
      tags: ['formal', 'office', 'bestseller']
    },
    {
      name: 'Allen Solly Men Casual Check Shirt',
      brand: 'Allen Solly',
      description: 'Trendy casual check shirt in vibrant colors. Made from 100% cotton with a relaxed fit. Features a button-down collar and chest pocket.',
      price: 849, mrp: 1699,
      category: 'men', subcategory: 'Shirts', gender: 'Men',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Blue Check', 'Green Check', 'Red Check'],
      images: ['https://picsum.photos/seed/mshirt2a/400/500', 'https://picsum.photos/seed/mshirt2b/400/500'],
      rating: 4.3, review_count: 543, stock: 120, is_featured: 0,
      tags: ['casual', 'weekend']
    },
    // MEN - Jeans
    {
      name: 'Roadster Men Slim Fit Stretchable Jeans',
      brand: 'Roadster',
      description: 'Modern slim fit jeans with superior stretch for all-day comfort. Features a mid-rise waistband and tapered leg. Made from premium denim with stretch technology.',
      price: 1199, mrp: 2299,
      category: 'men', subcategory: 'Jeans', gender: 'Men',
      sizes: ['28', '30', '32', '34', '36'],
      colors: ['Blue', 'Black', 'Dark Grey'],
      images: ['https://picsum.photos/seed/mjeans1a/400/500', 'https://picsum.photos/seed/mjeans1b/400/500'],
      rating: 4.4, review_count: 2876, stock: 220, is_featured: 0,
      tags: ['denim', 'casual', 'bestseller']
    },
    // MEN - Trousers
    {
      name: 'Van Heusen Men Slim Fit Formal Trousers',
      brand: 'Van Heusen',
      description: 'Impeccably tailored formal trousers in premium stretch fabric. Features a flat front design and side pockets. Machine washable for easy care.',
      price: 1099, mrp: 2199,
      category: 'men', subcategory: 'Trousers', gender: 'Men',
      sizes: ['28', '30', '32', '34', '36', '38'],
      colors: ['Black', 'Navy', 'Charcoal', 'Khaki'],
      images: ['https://picsum.photos/seed/mtrousers1a/400/500', 'https://picsum.photos/seed/mtrousers1b/400/500'],
      rating: 4.5, review_count: 1234, stock: 130, is_featured: 0,
      tags: ['formal', 'office']
    },
    // MEN - Ethnic Wear
    {
      name: 'Manyavar Men Embroidered Sherwani',
      brand: 'Manyavar',
      description: 'Royal embroidered sherwani with intricate zardozi work. Crafted from premium silk blend fabric. Comes with matching churidar and a decorative sash.',
      price: 4999, mrp: 8999,
      category: 'men', subcategory: 'Ethnic Wear', gender: 'Men',
      sizes: ['38', '40', '42', '44', '46'],
      colors: ['Ivory', 'Maroon', 'Navy'],
      images: ['https://picsum.photos/seed/meth1a/400/500', 'https://picsum.photos/seed/meth1b/400/500'],
      rating: 4.8, review_count: 234, stock: 25, is_featured: 1,
      tags: ['wedding', 'festive', 'premium']
    },
    {
      name: 'Fabindia Men Handloom Kurta Pyjama Set',
      brand: 'Fabindia',
      description: 'Classic handloom cotton kurta pyjama set with minimal embroidery. Features a mandarin collar and straight hem. Perfect for festive occasions.',
      price: 1799, mrp: 2999,
      category: 'men', subcategory: 'Ethnic Wear', gender: 'Men',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['White', 'Off-White', 'Light Blue'],
      images: ['https://picsum.photos/seed/meth2a/400/500', 'https://picsum.photos/seed/meth2b/400/500'],
      rating: 4.6, review_count: 456, stock: 70, is_featured: 0,
      tags: ['festive', 'handloom']
    },
    // MEN - Jackets
    {
      name: 'HRX Men Windcheater Jacket',
      brand: 'HRX',
      description: 'Lightweight windcheater jacket with water-resistant coating. Features a full zip closure and multiple pockets. Packable design for easy storage.',
      price: 1499, mrp: 2999,
      category: 'men', subcategory: 'Jackets', gender: 'Men',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Black', 'Navy', 'Olive'],
      images: ['https://picsum.photos/seed/mjacket1a/400/500', 'https://picsum.photos/seed/mjacket1b/400/500'],
      rating: 4.3, review_count: 678, stock: 90, is_featured: 1,
      tags: ['sports', 'outdoor']
    },
    {
      name: 'Roadster Men Puffer Jacket',
      brand: 'Roadster',
      description: 'Warm and stylish puffer jacket with quilted design. Features synthetic fill insulation, ribbed cuffs, and a hood. Perfect for winter.',
      price: 2499, mrp: 4499,
      category: 'men', subcategory: 'Jackets', gender: 'Men',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Black', 'Olive', 'Burgundy'],
      images: ['https://picsum.photos/seed/mjacket2a/400/500', 'https://picsum.photos/seed/mjacket2b/400/500'],
      rating: 4.4, review_count: 345, stock: 60, is_featured: 0,
      tags: ['winter', 'trending']
    },
    // KIDS - Boys Clothing
    {
      name: 'HRX Boys Solid T-shirt',
      brand: 'HRX',
      description: 'Comfortable and colorful t-shirt for active boys. Made from soft cotton that is gentle on kids skin. Features a crew neck and short sleeves.',
      price: 299, mrp: 599,
      category: 'kids', subcategory: 'Boys Clothing', gender: 'Kids',
      sizes: ['2-3Y', '3-4Y', '4-5Y', '5-6Y', '6-7Y', '7-8Y'],
      colors: ['Red', 'Blue', 'Yellow', 'Green'],
      images: ['https://picsum.photos/seed/kboys1a/400/500', 'https://picsum.photos/seed/kboys1b/400/500'],
      rating: 4.2, review_count: 567, stock: 200, is_featured: 0,
      tags: ['kids', 'casual']
    },
    {
      name: 'Roadster Boys Graphic Hoodie',
      brand: 'Roadster',
      description: 'Fun graphic hoodie with cartoon print for young boys. Made from fleece fabric for extra warmth. Features a kangaroo pocket and adjustable drawstring hood.',
      price: 699, mrp: 1299,
      category: 'kids', subcategory: 'Boys Clothing', gender: 'Kids',
      sizes: ['4-5Y', '5-6Y', '6-7Y', '7-8Y', '8-9Y', '9-10Y'],
      colors: ['Grey', 'Navy', 'Black'],
      images: ['https://picsum.photos/seed/kboys2a/400/500', 'https://picsum.photos/seed/kboys2b/400/500'],
      rating: 4.5, review_count: 234, stock: 120, is_featured: 0,
      tags: ['kids', 'winter', 'trendy']
    },
    // KIDS - Girls Clothing
    {
      name: 'Libas Girls Floral Frock',
      brand: 'Libas',
      description: 'Adorable floral frock for little girls. Made from soft cotton with a flared skirt and lace trim. Features a back zip closure and puffed sleeves.',
      price: 499, mrp: 899,
      category: 'kids', subcategory: 'Girls Clothing', gender: 'Kids',
      sizes: ['2-3Y', '3-4Y', '4-5Y', '5-6Y', '6-7Y'],
      colors: ['Pink', 'Yellow', 'Lilac'],
      images: ['https://picsum.photos/seed/kgirls1a/400/500', 'https://picsum.photos/seed/kgirls1b/400/500'],
      rating: 4.6, review_count: 345, stock: 150, is_featured: 0,
      tags: ['kids', 'cute', 'festive']
    },
    // KIDS - Footwear
    {
      name: 'HRX Kids Sports Sneakers',
      brand: 'HRX',
      description: 'Lightweight and durable sports sneakers for active kids. Features a velcro closure for easy on and off. Anti-skid sole for safety.',
      price: 799, mrp: 1499,
      category: 'kids', subcategory: 'Footwear', gender: 'Kids',
      sizes: ['UK 1', 'UK 2', 'UK 3', 'UK 4', 'UK 5'],
      colors: ['Blue', 'Pink', 'White'],
      images: ['https://picsum.photos/seed/kfoot1a/400/500', 'https://picsum.photos/seed/kfoot1b/400/500'],
      rating: 4.3, review_count: 456, stock: 100, is_featured: 0,
      tags: ['kids', 'sports']
    },
    // BEAUTY - Skincare
    {
      name: 'Neutrogena Hydrating Moisturizer SPF 50',
      brand: 'Neutrogena',
      description: 'Lightweight hydrating moisturizer with SPF 50 protection. Oil-free formula that hydrates skin while protecting from UV rays. Non-comedogenic, suitable for all skin types.',
      price: 649, mrp: 899,
      category: 'beauty', subcategory: 'Skincare', gender: 'Unisex',
      sizes: ['50ml', '100ml'],
      colors: ['N/A'],
      images: ['https://picsum.photos/seed/skin1a/400/500', 'https://picsum.photos/seed/skin1b/400/500'],
      rating: 4.5, review_count: 1876, stock: 300, is_featured: 0,
      tags: ['skincare', 'SPF', 'bestseller']
    },
    {
      name: 'Mamaearth Vitamin C Face Serum',
      brand: 'Mamaearth',
      description: 'Potent Vitamin C face serum for brightening and anti-aging. Contains 10% Vitamin C and hyaluronic acid. Reduces dark spots and gives a radiant glow.',
      price: 499, mrp: 799,
      category: 'beauty', subcategory: 'Skincare', gender: 'Unisex',
      sizes: ['30ml'],
      colors: ['N/A'],
      images: ['https://picsum.photos/seed/skin2a/400/500', 'https://picsum.photos/seed/skin2b/400/500'],
      rating: 4.4, review_count: 2341, stock: 250, is_featured: 1,
      tags: ['skincare', 'vitamin-c', 'trending']
    },
    // BEAUTY - Makeup
    {
      name: 'Lakme 9 to 5 Weightless Foundation',
      brand: 'Lakme',
      description: 'Buildable coverage foundation with a natural finish. Lightweight formula that stays put for 16 hours. Contains SPF 40 and skin-nourishing ingredients.',
      price: 499, mrp: 699,
      category: 'beauty', subcategory: 'Makeup', gender: 'Women',
      sizes: ['30ml'],
      colors: ['Ivory', 'Beige', 'Natural', 'Honey', 'Almond'],
      images: ['https://picsum.photos/seed/makeup1a/400/500', 'https://picsum.photos/seed/makeup1b/400/500'],
      rating: 4.3, review_count: 3456, stock: 200, is_featured: 0,
      tags: ['makeup', 'foundation', 'bestseller']
    },
    {
      name: 'Nykaa Matte to Last Lipstick',
      brand: 'Nykaa',
      description: 'Long-lasting matte lipstick that stays for up to 12 hours. Intensely pigmented formula with moisturizing ingredients. Available in 20 stunning shades.',
      price: 349, mrp: 549,
      category: 'beauty', subcategory: 'Makeup', gender: 'Women',
      sizes: ['3.5g'],
      colors: ['Red', 'Pink', 'Nude', 'Berry', 'Coral'],
      images: ['https://picsum.photos/seed/makeup2a/400/500', 'https://picsum.photos/seed/makeup2b/400/500'],
      rating: 4.5, review_count: 4521, stock: 400, is_featured: 0,
      tags: ['makeup', 'lipstick', 'matte']
    },
    // BEAUTY - Haircare
    {
      name: 'Dove Intense Repair Shampoo',
      brand: 'Dove',
      description: 'Intensive repair shampoo for damaged and dry hair. Infused with keratin actives and silk proteins to restore shine and strength.',
      price: 299, mrp: 449,
      category: 'beauty', subcategory: 'Haircare', gender: 'Unisex',
      sizes: ['180ml', '340ml', '650ml'],
      colors: ['N/A'],
      images: ['https://picsum.photos/seed/hair1a/400/500', 'https://picsum.photos/seed/hair1b/400/500'],
      rating: 4.3, review_count: 5678, stock: 500, is_featured: 0,
      tags: ['haircare', 'shampoo', 'bestseller']
    },
    // FOOTWEAR - Sneakers
    {
      name: 'Nike Air Max 270 React',
      brand: 'Nike',
      description: 'Iconic Air Max 270 with React foam cushioning for superior comfort. Features a mesh upper for breathability and a bold Air unit for maximum cushioning.',
      price: 4499, mrp: 7999,
      category: 'footwear', subcategory: 'Sneakers', gender: 'Unisex',
      sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
      colors: ['White/Black', 'Black/Red', 'Grey/Blue'],
      images: ['https://picsum.photos/seed/sneak1a/400/500', 'https://picsum.photos/seed/sneak1b/400/500'],
      rating: 4.7, review_count: 1234, stock: 80, is_featured: 1,
      tags: ['sports', 'sneakers', 'premium']
    },
    {
      name: 'Puma Men RS-X Bold Sneakers',
      brand: 'Puma',
      description: 'Retro-inspired RS-X Bold sneakers with chunky silhouette. Features RS cushioning technology and a multi-colored upper for a statement look.',
      price: 3499, mrp: 5999,
      category: 'footwear', subcategory: 'Sneakers', gender: 'Men',
      sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10'],
      colors: ['White/Blue', 'Black/Yellow', 'Grey/Red'],
      images: ['https://picsum.photos/seed/sneak2a/400/500', 'https://picsum.photos/seed/sneak2b/400/500'],
      rating: 4.5, review_count: 567, stock: 60, is_featured: 1,
      tags: ['sports', 'trending', 'retro']
    },
    {
      name: 'HRX Women Running Shoes',
      brand: 'HRX',
      description: 'Lightweight running shoes with superior cushioning and support. Features a breathable mesh upper and responsive foam midsole. Perfect for daily runs.',
      price: 1799, mrp: 2999,
      category: 'footwear', subcategory: 'Sneakers', gender: 'Women',
      sizes: ['UK 3', 'UK 4', 'UK 5', 'UK 6', 'UK 7'],
      colors: ['Pink/White', 'Black/Pink', 'Blue/White'],
      images: ['https://picsum.photos/seed/sneak3a/400/500', 'https://picsum.photos/seed/sneak3b/400/500'],
      rating: 4.3, review_count: 876, stock: 100, is_featured: 0,
      tags: ['sports', 'running']
    },
    // FOOTWEAR - Heels
    {
      name: 'Inc 5 Women Block Heel Sandals',
      brand: 'Inc 5',
      description: 'Elegant block heel sandals with an ankle strap closure. Features a cushioned footbed and non-slip sole. Perfect for office and evening occasions.',
      price: 999, mrp: 1999,
      category: 'footwear', subcategory: 'Heels', gender: 'Women',
      sizes: ['UK 3', 'UK 4', 'UK 5', 'UK 6', 'UK 7'],
      colors: ['Black', 'Nude', 'Red'],
      images: ['https://picsum.photos/seed/heels1a/400/500', 'https://picsum.photos/seed/heels1b/400/500'],
      rating: 4.2, review_count: 432, stock: 70, is_featured: 0,
      tags: ['heels', 'office', 'party']
    },
    // FOOTWEAR - Sandals
    {
      name: 'Bata Men Leather Sandals',
      brand: 'Bata',
      description: 'Premium genuine leather sandals with a traditional design. Features multiple adjustable straps and a comfortable cushioned footbed. Ideal for daily wear.',
      price: 699, mrp: 1299,
      category: 'footwear', subcategory: 'Sandals', gender: 'Men',
      sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
      colors: ['Brown', 'Black', 'Tan'],
      images: ['https://picsum.photos/seed/sandals1a/400/500', 'https://picsum.photos/seed/sandals1b/400/500'],
      rating: 4.1, review_count: 678, stock: 120, is_featured: 0,
      tags: ['sandals', 'leather', 'casual']
    },
    // FOOTWEAR - Formal Shoes
    {
      name: 'Hush Puppies Men Leather Oxford Shoes',
      brand: 'Hush Puppies',
      description: 'Classic leather Oxford shoes with a timeless design. Features genuine leather upper and lining for breathability and comfort. Ideal for formal occasions.',
      price: 2499, mrp: 4499,
      category: 'footwear', subcategory: 'Formal Shoes', gender: 'Men',
      sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10'],
      colors: ['Black', 'Brown'],
      images: ['https://picsum.photos/seed/formal1a/400/500', 'https://picsum.photos/seed/formal1b/400/500'],
      rating: 4.6, review_count: 345, stock: 50, is_featured: 0,
      tags: ['formal', 'leather', 'office']
    },
    // More products to reach 60+
    {
      name: 'Libas Women Palazzo Set',
      brand: 'Libas',
      description: 'Comfortable and stylish palazzo set with flowy fabric. Includes a printed top and matching wide-leg palazzo pants. Perfect for casual outings.',
      price: 899, mrp: 1699,
      category: 'women', subcategory: 'Ethnic Wear', gender: 'Women',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Pink', 'Blue', 'Green'],
      images: ['https://picsum.photos/seed/palazzo1a/400/500', 'https://picsum.photos/seed/palazzo1b/400/500'],
      rating: 4.2, review_count: 543, stock: 130, is_featured: 0,
      tags: ['ethnic', 'palazzo', 'casual']
    },
    {
      name: 'Roadster Men Cargo Joggers',
      brand: 'Roadster',
      description: 'Modern cargo joggers with multiple utility pockets. Made from cotton-blend fabric with elastic waistband and cuffs. Combines style with functionality.',
      price: 849, mrp: 1599,
      category: 'men', subcategory: 'Trousers', gender: 'Men',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Olive', 'Black', 'Khaki', 'Grey'],
      images: ['https://picsum.photos/seed/cargo1a/400/500', 'https://picsum.photos/seed/cargo1b/400/500'],
      rating: 4.3, review_count: 765, stock: 150, is_featured: 0,
      tags: ['casual', 'streetwear', 'trending']
    },
    {
      name: 'W Women Layered Maxi Skirt',
      brand: 'W',
      description: 'Graceful layered maxi skirt with a flowy silhouette. Features a tiered design with printed fabric and an elastic waistband for comfort.',
      price: 1099, mrp: 1999,
      category: 'women', subcategory: 'Ethnic Wear', gender: 'Women',
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Floral', 'Geometric', 'Abstract'],
      images: ['https://picsum.photos/seed/skirt1a/400/500', 'https://picsum.photos/seed/skirt1b/400/500'],
      rating: 4.4, review_count: 287, stock: 90, is_featured: 0,
      tags: ['skirt', 'ethnic', 'trending']
    },
    {
      name: 'HRX Men Sports Shorts',
      brand: 'HRX',
      description: 'Lightweight sports shorts with quick-dry technology. Features an elastic waistband with drawstring and side pockets. Perfect for gym and outdoor activities.',
      price: 399, mrp: 799,
      category: 'men', subcategory: 'T-Shirts', gender: 'Men',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Black', 'Navy', 'Red', 'Grey'],
      images: ['https://picsum.photos/seed/shorts1a/400/500', 'https://picsum.photos/seed/shorts1b/400/500'],
      rating: 4.2, review_count: 1234, stock: 200, is_featured: 0,
      tags: ['sports', 'gym', 'casual']
    },
    {
      name: 'Fabindia Women Linen Kurta',
      brand: 'Fabindia',
      description: 'Breathable linen kurta with minimal design. Features a simple mandarin collar and straight cut. Perfect for summer and casual occasions.',
      price: 1299, mrp: 2199,
      category: 'women', subcategory: 'Kurtas', gender: 'Women',
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Natural', 'Sage', 'Dusty Rose'],
      images: ['https://picsum.photos/seed/lkurta1a/400/500', 'https://picsum.photos/seed/lkurta1b/400/500'],
      rating: 4.6, review_count: 423, stock: 70, is_featured: 0,
      tags: ['linen', 'sustainable', 'casual']
    },
    {
      name: 'Allen Solly Men Chinos',
      brand: 'Allen Solly',
      description: 'Classic chinos with a smart casual fit. Made from cotton-stretch fabric for comfort throughout the day. Features a flat front and straight leg.',
      price: 1299, mrp: 2499,
      category: 'men', subcategory: 'Trousers', gender: 'Men',
      sizes: ['28', '30', '32', '34', '36'],
      colors: ['Khaki', 'Navy', 'Olive', 'Stone'],
      images: ['https://picsum.photos/seed/chinos1a/400/500', 'https://picsum.photos/seed/chinos1b/400/500'],
      rating: 4.5, review_count: 876, stock: 110, is_featured: 0,
      tags: ['chinos', 'smart-casual', 'office']
    },
    {
      name: 'Puma Women Training Leggings',
      brand: 'Puma',
      description: 'High-performance training leggings with compression fit. Features moisture-wicking fabric and a wide waistband. Perfect for yoga and gym workouts.',
      price: 1199, mrp: 2199,
      category: 'women', subcategory: 'Jeans', gender: 'Women',
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Black', 'Navy', 'Grey'],
      images: ['https://picsum.photos/seed/legging1a/400/500', 'https://picsum.photos/seed/legging1b/400/500'],
      rating: 4.4, review_count: 987, stock: 150, is_featured: 0,
      tags: ['sports', 'gym', 'yoga']
    },
    {
      name: 'Manyavar Men Kurta Pyjama',
      brand: 'Manyavar',
      description: 'Designer kurta pyjama set with subtle brocade fabric. Features a Nehru collar and self-embossed pattern. Perfect for festive celebrations.',
      price: 2499, mrp: 4499,
      category: 'men', subcategory: 'Ethnic Wear', gender: 'Men',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Gold', 'Silver', 'Cream'],
      images: ['https://picsum.photos/seed/mkurta1a/400/500', 'https://picsum.photos/seed/mkurta1b/400/500'],
      rating: 4.7, review_count: 312, stock: 45, is_featured: 1,
      tags: ['ethnic', 'festive', 'wedding']
    },
    {
      name: 'Nike Women Air Force 1 Sneakers',
      brand: 'Nike',
      description: 'Iconic Air Force 1 sneakers in a clean white colorway. Features a leather upper and Air cushioning for all-day comfort. A timeless classic.',
      price: 3999, mrp: 6999,
      category: 'footwear', subcategory: 'Sneakers', gender: 'Women',
      sizes: ['UK 3', 'UK 4', 'UK 5', 'UK 6', 'UK 7'],
      colors: ['White', 'White/Pink', 'Black'],
      images: ['https://picsum.photos/seed/nikeaf1a/400/500', 'https://picsum.photos/seed/nikeaf1b/400/500'],
      rating: 4.8, review_count: 892, stock: 65, is_featured: 1,
      tags: ['sneakers', 'classic', 'premium']
    },
    {
      name: 'Lakme Absolute Gel Styler',
      brand: 'Lakme',
      description: 'Professional-grade hair gel for long-lasting hold and shine. Provides flexible hold without stiffness. Suitable for all hair types.',
      price: 149, mrp: 249,
      category: 'beauty', subcategory: 'Haircare', gender: 'Unisex',
      sizes: ['75g', '150g'],
      colors: ['N/A'],
      images: ['https://picsum.photos/seed/hairgel1a/400/500', 'https://picsum.photos/seed/hairgel1b/400/500'],
      rating: 4.0, review_count: 2134, stock: 400, is_featured: 0,
      tags: ['haircare', 'styling']
    },
    {
      name: 'Roadster Women Denim Jacket',
      brand: 'Roadster',
      description: 'Classic denim jacket with a relaxed fit. Features a button-front closure, chest flap pockets, and a slightly distressed finish. A wardrobe essential.',
      price: 1499, mrp: 2799,
      category: 'women', subcategory: 'Tops', gender: 'Women',
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Blue Denim', 'Black Denim', 'White Denim'],
      images: ['https://picsum.photos/seed/denjacket1a/400/500', 'https://picsum.photos/seed/denjacket1b/400/500'],
      rating: 4.5, review_count: 654, stock: 80, is_featured: 0,
      tags: ['denim', 'jacket', 'casual']
    },
    {
      name: 'Biba Girls Embroidered Anarkali',
      brand: 'Biba',
      description: 'Beautiful embroidered Anarkali dress for little girls. Features a flared skirt and delicate embroidery on the yoke. Perfect for festive occasions.',
      price: 799, mrp: 1499,
      category: 'kids', subcategory: 'Girls Clothing', gender: 'Kids',
      sizes: ['2-3Y', '3-4Y', '4-5Y', '5-6Y', '6-7Y'],
      colors: ['Pink', 'Red', 'Blue'],
      images: ['https://picsum.photos/seed/kgirls2a/400/500', 'https://picsum.photos/seed/kgirls2b/400/500'],
      rating: 4.7, review_count: 234, stock: 80, is_featured: 0,
      tags: ['kids', 'festive', 'ethnic']
    },
    {
      name: 'Van Heusen Men Striped Blazer',
      brand: 'Van Heusen',
      description: 'Premium striped blazer with a tailored fit. Made from poly-viscose fabric with a structured shoulder and single-breasted button closure.',
      price: 2999, mrp: 5499,
      category: 'men', subcategory: 'Jackets', gender: 'Men',
      sizes: ['38', '40', '42', '44', '46'],
      colors: ['Navy Stripe', 'Grey Stripe', 'Black'],
      images: ['https://picsum.photos/seed/blazer1a/400/500', 'https://picsum.photos/seed/blazer1b/400/500'],
      rating: 4.6, review_count: 187, stock: 35, is_featured: 0,
      tags: ['formal', 'office', 'blazer']
    },
    {
      name: 'Inc 5 Women Flat Kolhapuri Sandals',
      brand: 'Inc 5',
      description: 'Handcrafted Kolhapuri sandals with traditional motifs. Made from genuine leather with a comfortable flat sole. A fusion of tradition and style.',
      price: 599, mrp: 1099,
      category: 'footwear', subcategory: 'Sandals', gender: 'Women',
      sizes: ['UK 3', 'UK 4', 'UK 5', 'UK 6', 'UK 7'],
      colors: ['Tan', 'Black', 'Brown'],
      images: ['https://picsum.photos/seed/kolha1a/400/500', 'https://picsum.photos/seed/kolha1b/400/500'],
      rating: 4.4, review_count: 567, stock: 90, is_featured: 0,
      tags: ['sandals', 'ethnic', 'handcrafted']
    },
    {
      name: 'Forest Essentials Luxury Sugar Lip Balm',
      brand: 'Forest Essentials',
      description: 'Luxurious sugar lip balm with natural ingredients. Infused with coconut oil and sugar to gently exfoliate and moisturize lips.',
      price: 599, mrp: 875,
      category: 'beauty', subcategory: 'Skincare', gender: 'Unisex',
      sizes: ['12g'],
      colors: ['Rose', 'Mango', 'Vanilla'],
      images: ['https://picsum.photos/seed/lipbalm1a/400/500', 'https://picsum.photos/seed/lipbalm1b/400/500'],
      rating: 4.7, review_count: 1234, stock: 200, is_featured: 0,
      tags: ['skincare', 'luxury', 'natural']
    },
    {
      name: 'Libas Women Anarkali Suit Set',
      brand: 'Libas',
      description: 'Elegant Anarkali suit set with a printed top and palazzos. Comes with a matching dupatta. Perfect for festive and casual occasions.',
      price: 1199, mrp: 2199,
      category: 'women', subcategory: 'Ethnic Wear', gender: 'Women',
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Peach', 'Green', 'Blue'],
      images: ['https://picsum.photos/seed/anarkali1a/400/500', 'https://picsum.photos/seed/anarkali1b/400/500'],
      rating: 4.3, review_count: 678, stock: 100, is_featured: 0,
      tags: ['ethnic', 'festive', 'anarkali']
    },
    {
      name: 'Roadster Men Hoodie Sweatshirt',
      brand: 'Roadster',
      description: 'Cozy pullover hoodie in fleece fabric. Features a kangaroo pocket and adjustable drawstring hood. Perfect for casual outings and lounging.',
      price: 899, mrp: 1699,
      category: 'men', subcategory: 'Jackets', gender: 'Men',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Charcoal', 'Navy', 'Burgundy', 'Olive'],
      images: ['https://picsum.photos/seed/hoodie1a/400/500', 'https://picsum.photos/seed/hoodie1b/400/500'],
      rating: 4.4, review_count: 1543, stock: 180, is_featured: 0,
      tags: ['casual', 'winter', 'trending']
    },
    {
      name: 'Nykaa Skin Luminous Highlighter',
      brand: 'Nykaa',
      description: 'Buildable highlighter for a luminous glow. Finely milled pearl pigments that blend seamlessly into skin. Long-lasting formula.',
      price: 399, mrp: 599,
      category: 'beauty', subcategory: 'Makeup', gender: 'Women',
      sizes: ['8g'],
      colors: ['Golden', 'Rose Gold', 'Pearl'],
      images: ['https://picsum.photos/seed/highlight1a/400/500', 'https://picsum.photos/seed/highlight1b/400/500'],
      rating: 4.4, review_count: 876, stock: 250, is_featured: 0,
      tags: ['makeup', 'glow', 'highlighter']
    },
    {
      name: 'Aurelia Women Embroidered Kurta Set',
      brand: 'Aurelia',
      description: 'Beautiful embroidered kurta set with matching bottoms. Features delicate thread embroidery on the neckline and hem. Made from soft polyester blend.',
      price: 1399, mrp: 2499,
      category: 'women', subcategory: 'Kurtas', gender: 'Women',
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Mint Green', 'Powder Blue', 'Blush Pink'],
      images: ['https://picsum.photos/seed/kurta5a/400/500', 'https://picsum.photos/seed/kurta5b/400/500'],
      rating: 4.5, review_count: 432, stock: 85, is_featured: 0,
      tags: ['kurta', 'set', 'embroidered']
    },
    {
      name: 'Puma Men Running Shoes',
      brand: 'Puma',
      description: 'High-performance running shoes with IGNITE foam cushioning. Features a breathable mesh upper and rubber outsole for traction on all surfaces.',
      price: 2999, mrp: 4999,
      category: 'footwear', subcategory: 'Sneakers', gender: 'Men',
      sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
      colors: ['Black/Yellow', 'Blue/White', 'Red/Black'],
      images: ['https://picsum.photos/seed/pumarun1a/400/500', 'https://picsum.photos/seed/pumarun1b/400/500'],
      rating: 4.5, review_count: 765, stock: 75, is_featured: 0,
      tags: ['sports', 'running', 'performance']
    },
    {
      name: 'HRX Women Sports Bra',
      brand: 'HRX',
      description: 'Medium-support sports bra with moisture-wicking fabric. Features removable padding and wide shoulder straps for comfort during workouts.',
      price: 499, mrp: 999,
      category: 'women', subcategory: 'Tops', gender: 'Women',
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Black', 'Grey', 'Navy', 'Pink'],
      images: ['https://picsum.photos/seed/sportsbra1a/400/500', 'https://picsum.photos/seed/sportsbra1b/400/500'],
      rating: 4.2, review_count: 1876, stock: 200, is_featured: 0,
      tags: ['sports', 'gym', 'workout']
    },
    {
      name: 'Roadster Boys Slim Fit Jeans',
      brand: 'Roadster',
      description: 'Trendy slim fit jeans for boys with stretch denim. Features adjustable inner waistband and reinforced knees for durability.',
      price: 699, mrp: 1299,
      category: 'kids', subcategory: 'Boys Clothing', gender: 'Kids',
      sizes: ['4-5Y', '5-6Y', '6-7Y', '7-8Y', '8-9Y'],
      colors: ['Blue', 'Black', 'Dark Grey'],
      images: ['https://picsum.photos/seed/kboys3a/400/500', 'https://picsum.photos/seed/kboys3b/400/500'],
      rating: 4.3, review_count: 345, stock: 130, is_featured: 0,
      tags: ['kids', 'denim', 'casual']
    },
    {
      name: 'Mamaearth Onion Hair Oil',
      brand: 'Mamaearth',
      description: 'Nourishing onion hair oil to reduce hair fall and promote growth. Enriched with onion extracts and redensyl. Paraben-free and toxin-free formula.',
      price: 349, mrp: 499,
      category: 'beauty', subcategory: 'Haircare', gender: 'Unisex',
      sizes: ['150ml', '250ml'],
      colors: ['N/A'],
      images: ['https://picsum.photos/seed/hairoil1a/400/500', 'https://picsum.photos/seed/hairoil1b/400/500'],
      rating: 4.3, review_count: 7654, stock: 600, is_featured: 0,
      tags: ['haircare', 'natural', 'bestseller']
    },
    {
      name: 'W Women Printed Palazzo',
      brand: 'W',
      description: 'Comfortable printed palazzo pants in soft rayon fabric. Features an elastic waistband and vibrant ethnic print. Perfect for daily wear.',
      price: 699, mrp: 1299,
      category: 'women', subcategory: 'Ethnic Wear', gender: 'Women',
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      colors: ['Blue Print', 'Pink Print', 'Green Print'],
      images: ['https://picsum.photos/seed/palazzo2a/400/500', 'https://picsum.photos/seed/palazzo2b/400/500'],
      rating: 4.1, review_count: 543, stock: 150, is_featured: 0,
      tags: ['palazzo', 'ethnic', 'casual']
    },
    {
      name: 'Van Heusen Men Sports Shoes',
      brand: 'Van Heusen',
      description: 'Versatile sports shoes that transition from gym to office. Features a leather upper with sporty accents and cushioned insole.',
      price: 1999, mrp: 3499,
      category: 'footwear', subcategory: 'Formal Shoes', gender: 'Men',
      sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10'],
      colors: ['White', 'Black', 'Grey'],
      images: ['https://picsum.photos/seed/vhshoes1a/400/500', 'https://picsum.photos/seed/vhshoes1b/400/500'],
      rating: 4.4, review_count: 432, stock: 60, is_featured: 0,
      tags: ['shoes', 'office', 'casual']
    },
  ];

  const insertProduct = db.transaction((products) => {
    for (const p of products) {
      productInsert.run(
        p.name, p.brand, p.description, p.price, p.mrp,
        categoryIds[p.category],
        p.subcategory, p.gender,
        JSON.stringify(p.sizes),
        JSON.stringify(p.colors),
        JSON.stringify(p.images),
        p.rating, p.review_count, p.stock, p.is_featured,
        JSON.stringify(p.tags)
      );
    }
  });

  insertProduct(products);
  console.log(`✅ ${products.length} products seeded`);

  // Create a test user
  const bcrypt = require('bcryptjs');
  const hashedPassword = bcrypt.hashSync('password123', 10);
  db.prepare(`INSERT INTO users (name, email, password) VALUES (?, ?, ?)`).run(
    'Demo User', 'demo@drape.com', hashedPassword
  );
  console.log('✅ Demo user created: demo@drape.com / password123');

  console.log('🎉 Seed complete!');
  process.exit(0);
}

seed();
