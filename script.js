// API Base URL
const API_BASE_URL = 'http://localhost:8000/api';

// Shopping cart state
let cart = [];
let menuItems = [];

// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Load menu items and enhance menu section
    loadMenuItems();

    // Form submission
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your message! We\'ll get back to you soon.');
            this.reset();
        });
    }

    // Newsletter subscription
    const newsletter = document.querySelector('.newsletter');
    if (newsletter) {
        newsletter.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for subscribing to our newsletter!');
            this.querySelector('input').value = '';
        });
    }
});

// Load menu items from API
async function loadMenuItems() {
    try {
        const response = await fetch(`${API_BASE_URL}/menu`);
        if (response.ok) {
            menuItems = await response.json();
            enhanceMenuSection();
        } else {
            console.error('Failed to load menu items');
            // Fallback to existing static menu
        }
    } catch (error) {
        console.error('Error loading menu items:', error);
        // Fallback to existing static menu
    }
}

// Enhance menu section with order buttons
function enhanceMenuSection() {
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach((item, index) => {
        const price = item.querySelector('.price').textContent;
        const name = item.querySelector('h4').textContent;
        const description = item.querySelector('p').textContent;
        
        // Add order button
        const orderBtn = document.createElement('button');
        orderBtn.textContent = 'Add to Cart';
        orderBtn.className = 'btn btn-order';
        orderBtn.onclick = () => addToCart(index + 1, name, description, parseFloat(price.replace('$', '').replace('From ', '')));
        
        item.appendChild(orderBtn);
    });

    // Create cart UI
    createCartUI();
}

// Add item to cart
function addToCart(menuItemId, name, description, price) {
    const existingItem = cart.find(item => item.menuItemId === menuItemId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            menuItemId,
            name,
            description,
            price,
            quantity: 1
        });
    }
    
    updateCartUI();
    showCartNotification(`${name} added to cart!`);
}

// Create cart UI
function createCartUI() {
    // Create cart button in header
    const nav = document.querySelector('.nav');
    const cartButton = document.createElement('button');
    cartButton.innerHTML = '<i class="fas fa-shopping-cart"></i> Cart (<span id="cart-count">0</span>)';
    cartButton.className = 'btn btn-cart';
    cartButton.onclick = toggleCart;
    nav.appendChild(cartButton);

    // Create cart sidebar
    const cartSidebar = document.createElement('div');
    cartSidebar.id = 'cart-sidebar';
    cartSidebar.className = 'cart-sidebar';
    cartSidebar.innerHTML = `
        <div class="cart-header">
            <h3>Your Order</h3>
            <button onclick="toggleCart()" class="cart-close">&times;</button>
        </div>
        <div class="cart-items" id="cart-items"></div>
        <div class="cart-footer">
            <div class="cart-total">Total: $<span id="cart-total">0.00</span></div>
            <button onclick="showCheckoutForm()" class="btn btn-primary">Checkout</button>
            <button onclick="clearCart()" class="btn btn-secondary">Clear Cart</button>
        </div>
    `;
    document.body.appendChild(cartSidebar);

    // Create checkout modal
    createCheckoutModal();
}

// Toggle cart sidebar
function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    sidebar.classList.toggle('open');
}

// Update cart UI
function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    // Update count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update items
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>$${item.price.toFixed(2)} each</p>
            </div>
            <div class="cart-item-controls">
                <button onclick="updateQuantity(${item.menuItemId}, -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="updateQuantity(${item.menuItemId}, 1)">+</button>
                <button onclick="removeFromCart(${item.menuItemId})" class="remove-btn">&times;</button>
            </div>
        </div>
    `).join('');
    
    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toFixed(2);
}

// Update item quantity
function updateQuantity(menuItemId, change) {
    const item = cart.find(item => item.menuItemId === menuItemId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(menuItemId);
        } else {
            updateCartUI();
        }
    }
}

// Remove item from cart
function removeFromCart(menuItemId) {
    cart = cart.filter(item => item.menuItemId !== menuItemId);
    updateCartUI();
}

// Clear entire cart
function clearCart() {
    cart = [];
    updateCartUI();
}

// Show cart notification
function showCartNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Create checkout modal
function createCheckoutModal() {
    const modal = document.createElement('div');
    modal.id = 'checkout-modal';
    modal.className = 'checkout-modal';
    modal.innerHTML = `
        <div class="checkout-content">
            <div class="checkout-header">
                <h3>Place Your Order</h3>
                <button onclick="closeCheckoutModal()" class="checkout-close">&times;</button>
            </div>
            <form id="checkout-form">
                <div class="form-group">
                    <label>Full Name *</label>
                    <input type="text" name="customer_name" required>
                </div>
                <div class="form-group">
                    <label>Email *</label>
                    <input type="email" name="customer_email" required>
                </div>
                <div class="form-group">
                    <label>Phone Number</label>
                    <input type="tel" name="customer_phone">
                </div>
                <div class="form-group">
                    <label>Special Instructions</label>
                    <textarea name="special_instructions" rows="3" placeholder="Any special requests or dietary requirements..."></textarea>
                </div>
                <div class="order-summary">
                    <h4>Order Summary</h4>
                    <div id="checkout-items"></div>
                    <div class="checkout-total">Total: $<span id="checkout-total">0.00</span></div>
                </div>
                <button type="submit" class="btn btn-primary">Place Order</button>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Handle form submission
    document.getElementById('checkout-form').addEventListener('submit', handleCheckout);
}

// Show checkout form
function showCheckoutForm() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const modal = document.getElementById('checkout-modal');
    const checkoutItems = document.getElementById('checkout-items');
    const checkoutTotal = document.getElementById('checkout-total');
    
    // Update order summary
    checkoutItems.innerHTML = cart.map(item => `
        <div class="checkout-item">
            <span>${item.name} x${item.quantity}</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    checkoutTotal.textContent = total.toFixed(2);
    
    modal.classList.add('open');
    toggleCart(); // Close cart sidebar
}

// Close checkout modal
function closeCheckoutModal() {
    document.getElementById('checkout-modal').classList.remove('open');
}

// Handle checkout form submission
async function handleCheckout(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const orderData = {
        customer_name: formData.get('customer_name'),
        customer_email: formData.get('customer_email'),
        customer_phone: formData.get('customer_phone') || null,
        special_instructions: formData.get('special_instructions') || null,
        items: cart.map(item => ({
            menu_item_id: item.menuItemId,
            quantity: item.quantity,
            unit_price: item.price
        }))
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData)
        });
        
        if (response.ok) {
            const order = await response.json();
            alert(`Order placed successfully! Order ID: ${order.id}\nWe'll contact you soon with pickup details.`);
            clearCart();
            closeCheckoutModal();
        } else {
            const error = await response.json();
            alert('Failed to place order: ' + (error.detail || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error placing order:', error);
        alert('Failed to place order. Please try again or call us directly.');
    }
} 