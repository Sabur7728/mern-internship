// Shopping Cart

const products = [
    {
        id: 1,
        name: "Laptop",
        price: 55000,
        quantity: 1
    },
    {
        id: 2,
        name: "Mouse",
        price: 800,
        quantity: 2
    },
    {
        id: 3,
        name: "Keyboard",
        price: 1500,
        quantity: 1
    },
    {
        id: 4,
        name: "Headphones",
        price: 2500,
        quantity: 2
    },
    {
        id: 5,
        name: "USB Cable",
        price: 500,
        quantity: 3
    }
];


// Function to calculate total cart value
function calculateCartValue(products) {

    return products.reduce((total, product) => {
        return total + (product.price * product.quantity);
    }, 0);

}


// Total number of different products
const totalProducts = products.length;


// Total quantity of all products
const totalQuantity = products.reduce((total, product) => {
    return total + product.quantity;
}, 0);


// Total cart value
const totalCartValue = calculateCartValue(products);


// Display results
console.log("Total Products:", totalProducts);
console.log("Total Quantity:", totalQuantity);
console.log("Total Cart Value: ₹" + totalCartValue);