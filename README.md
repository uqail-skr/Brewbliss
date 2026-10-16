# Brew Bliss Cafe

A one-page café website made with plain HTML, CSS, and JavaScript.

## Step-by-step guide

### 1. Open the project

Open the `Brew Bliss` folder in VS Code. The project does not require npm or a build tool.

### 2. Understand the files

- `index.html` contains the page content, menu structure, cart panel, checkout form, and contact form.
- `styles.css` contains the café colors, layout, responsive design, buttons, cards, cart panel, and form states.
- `script.js` contains the menu data, cart state, totals, form validation, and success messages.
- `images/` contains the local SVG artwork used by the hero and menu cards.

### 3. View the website

Double-click `index.html`, or right-click it in VS Code and choose **Open with Live Server** if that extension is installed.

### 4. Try the page

1. Use the navigation links to move between the story, menu, and visit sections.
2. Click **Add to order** on a menu item.
3. Open **Order now** to view the cart.
4. Increase, decrease, or remove items by changing their quantity to zero.
5. Select **Continue to checkout** and test the validation messages.
6. Submit valid checkout details to see an order confirmation.
7. Fill in the contact form and submit it to see `Thank you for contacting Brew Bliss Cafe!`.

## How the code works

### HTML

The page is divided into semantic sections: header, hero, story, menu, visit/contact, footer, and the cart aside. Anchor links such as `#menu` keep every workflow on one page.

The menu starts as an empty `<div id="menu-grid"></div>`. JavaScript fills it from the `menuItems` array, which makes it easy to add another drink later.

### CSS

CSS variables near the top of `styles.css` define the colors, fonts, borders, and shadow used throughout the design. The grid layouts change at the tablet and mobile breakpoints so the page remains usable on small screens.

The local SVG files provide offline artwork. To replace an image, add a new file to `images/` and update the matching `image` path in `script.js`.

### JavaScript cart

The `cart` Map stores each selected menu item and its quantity. The main functions are:

- `addToCart()` adds a product or increases its quantity.
- `changeQuantity()` increases, decreases, or removes a product.
- `getCartTotal()` calculates the total price.
- `renderCart()` redraws the cart panel after every change.
- `openCart()` and `closeCart()` control the slide-out cart.

### Form interaction

Both forms stop the browser's default page reload with `event.preventDefault()`. They validate fields, show field-specific errors, and then display a success message when the information is valid.

The checkout is intentionally a front-end demonstration. It does not charge a card or save customer data. A real payment system needs a secure server, a payment provider such as Stripe or PayHere, HTTPS, server-side validation, and protected credentials.

## Testing checklist

- Test the page at desktop, tablet, and mobile widths.
- Test an empty cart and a cart with several products.
- Try invalid names, short phone numbers, and invalid email addresses.
- Confirm the contact success message appears without a page reload.
- Use Tab to check keyboard focus states.
- Temporarily rename an image file to see that the layout remains stable while developing a replacement asset.
