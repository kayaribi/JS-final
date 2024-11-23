console.clear();

const baseUrl = "https://livejs-api.hexschool.io";
const apiPath = "kayaribi";
const customerApi = `${baseUrl}/api/livejs/v1/customer/${apiPath}`;
const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
    }
});

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
                <a href="#" class="addCardBtn" data-id="${item.id}">加入購物車</a>
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

// 加入購物車
function addToCart(id) {
    const addCardBtns = document.querySelectorAll(".addCardBtn");
    addCardBtns.forEach(item => {
        item.classList.add("disabled");
        console.log(item);
    })
    const data = {
        data: {
            productId: id,
            quantity: 1
        }
    };
    axios.post(`${customerApi}/carts`, data)
        .then(res => {
            cartData = res.data.carts;
            cartTotal = res.data.finalTotal;
            renderCart();
            Toast.fire({
                icon: "success",
                title: "商品成功加入購物車"
            });
            const addCardBtns = document.querySelectorAll(".addCardBtn");
            addCardBtns.forEach(item => {
                item.classList.remove("disabled");
            })
        }).catch(err => {
            console.log(err);
        });
}

productWrap.addEventListener("click", (e) => {
    e.preventDefault(); // 阻止預設行為(跳轉頁面)
    console.log(e.target);
    if (e.target.classList.contains("addCardBtn")) {
        addToCart(e.target.dataset.id);
    }
})

// 刪除所有購物車內容
// const discardAllBtn = document.querySelector(".discardAllBtn");

function deleteAllCart() {
    Swal.fire({
        title: "確定要刪除嗎?",
        text: "此動作無法還原購物車內容!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "是，請刪除!"
    }).then((result) => {
        if (result.isConfirmed) {
            axios.delete(`${customerApi}/carts`)
                .then(res => {
                    cartData = res.data.carts;
                    renderCart();
                }).catch(err => {
                    console.log(err);
                });
            Swal.fire({
                title: "已刪除!",
                text: "清空購物車",
                icon: "success"
            });
        }
    });
};

// discardAllBtn.addEventListener("click", (e) => {
//     e.preventDefault();
//     deleteAllCart();
// });

let cartData = [];
let cartTotal = 0;
// 渲染購物車
function getCart() {
    axios.get(`${customerApi}/carts`).then(res => {
        cartData = res.data.carts;
        cartTotal = res.data.finalTotal;
        renderCart();
    }).catch(err => {
        console.log(err);
    });
}

const shoppingCartTableBody = document.querySelector(".shoppingCart-table tbody");

const shoppingCartTableFoot = document.querySelector(".shoppingCart-table tfoot");

function renderCart() {
    if (cartData.length === 0) {
        shoppingCartTableBody.innerHTML = "購物車沒有商品";
        shoppingCartTableFoot.innerHTML = "";
        return;
    }
    let str = "";
    cartData.forEach(item => {
        str += `<tr data-id="${item.id}">
                    <td>
                        <div class="cardItem-title">
                            <img src="${item.product.images}" alt="">
                            <p>${item.product.title}</p>
                        </div>
                    </td>
                        <td>NT$${item.product.price}</td>
                        <td><button type="button" class="minusBtn">-</button>${item.quantity}<button type="button" class="addBtn">+</button></td>
                        <td>NT$${item.product.price * item.quantity}</td>
                        <td>
                            <a href="#" class="material-icons discardBtn">
                                clear
                            </a>
                    </td>
                </tr>`
    })
    shoppingCartTableBody.innerHTML = str;
    shoppingCartTableFoot.innerHTML = `<tr>
        <td>
            <a href="#" class="discardAllBtn">刪除所有品項</a>
        </td>
        <td></td>
        <td></td>
        <td>
            <p>總金額</p>
        </td>
        <td>NT$${cartTotal}</td>
    </tr>`;
    const discardAllBtn = document.querySelector(".discardAllBtn");
    discardAllBtn.addEventListener("click", (e) => {
        e.preventDefault();
        deleteAllCart();
    });
};

// 刪除單一產品
function deleteCart(id) {
    axios.delete(`${customerApi}/carts/${id}`)
        .then(res => {
            cartData = res.data.carts;
            cartTotal = res.data.finalTotal;
            renderCart();
        }).catch(err => {
            console.log(err);
        });
};

// 編輯產品數量
function updateCart(id, qty) {
    const data = {
        data: {
            id,
            quantity: qty
        }
    };
    axios.patch(`${customerApi}/carts/`, data)
        .then(res => {
            cartData = res.data.carts;
            cartTotal = res.data.finalTotal;
            renderCart();
        }).catch(err => {
            console.log(err);
        });
};

shoppingCartTableBody.addEventListener("click", (e) => {
    const id = e.target.closest("tr").getAttribute("data-id");
    e.preventDefault();
    if (e.target.classList.contains("discardBtn")) {
        deleteCart(id);
    }
    if (e.target.classList.contains("addBtn")) {
        let result = {};
        cartData.forEach(item => {
            if (item.id === id) {
                result = item;
            }
        })
        let qty = result.quantity + 1;
        updateCart(id, qty);
    }
    if (e.target.classList.contains("minusBtn")) {
        let result = {};
        cartData.forEach(item => {
            if (item.id === id) {
                result = item;
            }
        })
        let qty = result.quantity - 1;
        updateCart(id, qty);
    }
})

const orderInfoForm = document.querySelector(".orderInfo-form");
const orderInfoBtn = document.querySelector(".orderInfo-btn");

function checkForm() {
    const constraints = {
        姓名: {
            presence: { message: "^必填" },
        },
        電話: {
            presence: { message: "^必填" },
        },
        Email: {
            presence: { message: "^必填" },
            email: { message: "^請輸入正確的信箱格式" },
        },
        寄送地址: {
            presence: { message: "^必填" },
        },
    };
    const error = validate(orderInfoForm, constraints);
    console.log(error);
    return error;
}


function sendOrder() {
    if (cartData.length === 0) {
        alert("購物車沒有商品");
        return;
    }
    if (checkForm()) {
        alert("必填欄位未填");
        return;
    }
    const customerName = document.querySelector("#customerName");
    const customerPhone = document.querySelector("#customerPhone");
    const customerEmail = document.querySelector("#customerEmail");
    const customerAddress = document.querySelector("#customerAddress");
    const tradeWay = document.querySelector("#tradeWay");

    const data = {
        data: {
            user: {
                name: customerName.value.trim(),
                tel: customerPhone.value.trim(),
                email: customerEmail.value.trim(),
                address: customerAddress.value.trim(),
                payment: tradeWay.value,
            },
        },
    };
    axios.post(`${customerApi}/orders`, data)
        .then(res => {
            console.log(res);
            orderInfoForm.reset();
        })
        .catch(err => {
            console.log(err);
        })
}


orderInfoBtn.addEventListener("click", (e) => {
    e.preventDefault();
    sendOrder();
})



// 初始化
function init() {
    getProducts();
    getCart();
}

init();