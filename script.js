// Fetch product data from API
fetch('https://cdn.shopify.com/s/files/1/0564/3685/0790/files/singleProduct.json?v=1701948448')
    .then(response => response.json())
    .then(data => {
        setProductData(data.product);
    })
    .catch(error => console.error('Error fetching product data:', error));

// Set Product Data
function setProductData(product) {
    // Product details
    const productTitle = document.querySelector('.details h1');
    productTitle.textContent = product.title;

    const vendor = document.querySelector('.details p');
    vendor.textContent = product.vendor;

    const amountSpan = document.getElementById('amount');
    amountSpan.textContent = `${product.price}`;

    const prevPriceSpan = document.getElementById('prevprice');
    prevPriceSpan.innerHTML = `<s>${product.compare_at_price}</s>`;

    calculateDiscount();

    // Colors
    const colorPicker = document.getElementById('colorPicker');
    colorPicker.innerHTML = '';

    const colorValues = product.options.find(option => option.name === 'Color').values;

    colorValues.forEach((color, index) => {
        const colorDiv = document.createElement('div');
        const colorName = Object.keys(color)[0];
        const colorValue = color[colorName];

        colorDiv.classList.add('color', colorName.toLowerCase());
        colorDiv.onclick = function () {
            selectColor(this);
        };
        if (index === 0) {
            colorDiv.classList.add('active');
            appendTickImage(colorDiv);
        }
        colorPicker.appendChild(colorDiv);

        const styleSheet = document.styleSheets[0];
        const boxcolor = styleSheet.insertRule(`.colorpicker .color.${colorName.toLowerCase()} { background-color: ${colorValue}; }`, styleSheet.cssRules.length);

        const boxcolorborder = styleSheet.insertRule(`.colorpicker .color.${colorName.toLowerCase()}.active::before { display: block; border: 2px solid ${colorValue}; }`, styleSheet.cssRules.length);
    });

    // Sizes
    const sizesContainer = document.querySelector('.sizes');
    sizesContainer.innerHTML = '';
    product.options.find(option => option.name === 'Size').values.forEach((size, index) => {
        const label = document.createElement('label');
        const input = document.createElement('input');
        const span = document.createElement('span');

        input.type = 'radio';
        input.name = 'size';
        input.id = size.toLowerCase();
        input.onclick = function () {
            selectSize(size);
        };

        span.textContent = size;
        label.appendChild(input);
        label.appendChild(span);
        label.setAttribute('for', size.toLowerCase());
        if (index === 0) {
            label.classList.add('selected');
            input.checked = true;
        }
        sizesContainer.appendChild(label);
    });

    // Description
    const description = document.querySelector('.desc');
    description.innerHTML = product.description;
}


let count = 1;
let selectedSize = 'Small';
let selectedColor = "cream";


function increment() {
    count++;
    updateCounter();
}

function decrement() {
    if (count > 0) {
        count--;
        updateCounter();
    }
}

function updateCounter() {
    document.getElementById('counter').innerText = count;
}

function changeMainImage(element) {
    const smallGalleryImages = document.querySelectorAll('.smallgallery img');
    smallGalleryImages.forEach(img => img.style.border = 'none');
    element.style.border = '3px solid #000';
    const mainGalleryImage = document.getElementById('mainGalleryImage');
    mainGalleryImage.src = element.src;
}


function selectColor(element) {
    const colorDivs = document.querySelectorAll('.color');
    colorDivs.forEach(div => removeTickImage(div));
    colorDivs.forEach(div => div.classList.remove('active'));
    element.classList.add('active');
    appendTickImage(element);
    selectedColor = element.classList[1];
}

function removeTickImage(element) {
    const tickImage = element.querySelector('.tick');
    if (tickImage) {
        tickImage.remove();
    }
}

function setTickOnFirstColor() {
    const firstColor = document.querySelector('.color');
    firstColor.classList.add('active');
    appendTickImage(firstColor);
}

function appendTickImage(element) {
    const tickImage = document.createElement('img');
    tickImage.src = './assets/tick.png';
    tickImage.alt = 'Tick';
    tickImage.classList.add('tick');
    element.appendChild(tickImage);
}



function selectSize(size) {
    selectedSize = size;
    const sizeLabels = document.querySelectorAll('.sizes label');
    sizeLabels.forEach(label => label.classList.remove('selected'));
    const selectedLabel = document.querySelector(`label[for="${size.toLowerCase()}"]`);
    selectedLabel.classList.add('selected');
}



function calculateDiscount() {
    const amountSpan = document.getElementById('amount');
    const prevPriceSpan = document.getElementById('prevprice');
    const prevPrice = parseFloat(prevPriceSpan.textContent.slice(1));
    const amount = parseFloat(amountSpan.textContent.slice(1));
    const discountAmount = prevPrice - amount;
    const discountPercentage = (discountAmount / prevPrice) * 100;
    const formattedDiscountPercentage = discountPercentage.toFixed(0);
    const discountSpan = document.querySelector('.discount');
    discountSpan.textContent = `${formattedDiscountPercentage}% Off`;
}

function addToCart() {
    const productTitle = document.querySelector('.details h1').textContent;
    const cartDetailsDiv = document.getElementById('cartDetails');
    const productDetails = document.createElement('div');
    const count = parseInt(document.getElementById('counter').innerText);
    const countText = count > 1 ? ` ${count}` : '';
    productDetails.textContent = `${countText} ${productTitle} with Color ${selectedColor} and Size ${selectedSize} added to cart`;
    cartDetailsDiv.innerHTML = '';
    cartDetailsDiv.style.padding = "4px"
    cartDetailsDiv.appendChild(productDetails);
}