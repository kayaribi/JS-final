console.clear();

const baseUrl = "https://livejs-api.hexschool.io";
const apiPath = "kayaribi";
const customerApi = `${baseUrl}/api/livejs/v1/customer/${apiPath}`;


// 儲存產品列表
let productData = [];

// 取得產品列表
function getProducts() {
    axios.get(`${customerApi}/products`).then(res => {
        productData = res.data.products;
        renderProducts(productData);
        // console.log(productData);
    }).catch(err => {
        console.log(err);
    });
}

// 渲染產品
const productWrap = document.querySelector(".productWrap");


function renderProducts(data) {
    let str = "";
    data.forEach(item => {
        str += `<li class="productCard">
                <h4 class="productType">新品</h4>
                <img src="${item.images}"
                    alt="">
                <a href="#" class="addCardBtn">加入購物車</a>
                <h3>${item.title}</h3>
                <del class="originPrice">NT$${item.origin_price}</del>
                <p class="nowPrice">NT$${item.price}</p>
            </li>`
    })
    productWrap.innerHTML = str;
}

const productSelect = document.querySelector(".productSelect");

productSelect.addEventListener("change", (e) => {
    filterProducts(e.target.value);
});

// 篩選產品
function filterProducts(value) {
    const result = [];

    productData.forEach(item => {
        if (item.category === value) {
            result.push(item);
        } else if (value === "全部") {
            result.push(item);
        }
    })
    renderProducts(result);
}




// 渲染購物車
function getCart() {
    axios.get(`${customerApi}/carts`).then(res => {
        cartData = res.data.carts;
        console.log(cartData);
    }).catch(err => {
        console.log(err);
    });
}

function renderCart(data) {
    let str = "";
    data.forEach(item => {
        str += `            <li class="cartCard">
                <img src="${item.product.images}"
                    alt="">
                <h4>${item.product.title}</h4>
                <p>NT$${item.product.price}</p>
            </li>`
    })
    cartWrap.innerHTML = str;
}





// 初始化
function init() {
    getProducts();
    getCart();
}

init();