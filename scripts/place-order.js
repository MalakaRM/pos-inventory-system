let orders = [];

// 1. Initial Load Function
const loadIds = () => {
    loadCustomerIds();
    loadItemIds();
};

// 2. Load Customer IDs to Dropdown
const loadCustomerIds = () => {
    $('#customer-id').empty();
    $('#customer-id').append('<option value="">Select Customer ID</option>');

    const firestore = firebase.firestore();
    firestore.collection('customers').get().then((records) => {
        records.forEach((result) => {
            const option = `<option value="${result.id}">${result.id}</option>`;
            $('#customer-id').append(option);
        });
    });
};

// 3. Load Item IDs to Dropdown
const loadItemIds = () => {
    $('#item-id').empty();
    $('#item-id').append('<option value="">Select Item ID</option>');

    const firestore = firebase.firestore();
    firestore.collection('items').get().then((records) => {
        records.forEach((result) => {
            const option = `<option value="${result.id}">${result.id}</option>`;
            $('#item-id').append(option);
        });
    });
};

// 4. Change Event for Customer Select
$('#customer-id').on('change', function () {
    const customerId = $(this).val();

    if (customerId != "") {
        const firestore = firebase.firestore();
        firestore.collection('customers').doc(customerId).get().then((response) => {
            if (response.exists) {
                const data = response.data();
                $('#name').val(data.name);
                $('#address').val(data.address);
                $('#salary').val(data.salary);
            }
        });
    }
});

// 5. Change Event for Item Select (Cart එකේ තියෙන ප්‍රමාණය අඩු කරලා Real Available Stock එක පෙන්වීම)
$('#item-id').on('change', function () {
    const itemId = $(this).val();

    if (itemId != "") {
        const firestore = firebase.firestore();
        firestore.collection('items').doc(itemId).get().then((response) => {
            if (response.exists) {
                const data = response.data();
                const dbQtyOnHand = data.qtyOnHand; // DB එකේ තියෙන මුළු ප්‍රමාණය (උදා: 204)

                // Cart එකේ දැනට මේ Item එකෙන් කීයක් තියෙනවද බලනවා
                let qtyInCart = 0;
                for (let i = 0; i < orders.length; i++) {
                    if (orders[i].code == itemId) {
                        qtyInCart = orders[i].qty;
                        break;
                    }
                }

                // Field එකේ පෙන්වන්නේ DB එකේ ගණන - Cart එකේ ගණන (උදා: 204 - 200 = 4)
                const availableQty = dbQtyOnHand - qtyInCart;

                $('#description').val(data.description);
                $('#unit-price').val(data.unitPrice);
                $('#qty-on-hand').val(availableQty);
            }
        });
    }
});

// 6. Add Item to Cart
const addToCart = () => {
    const itemId = $('#item-id').val();
    const description = $('#description').val();
    const unitPrice = parseFloat($('#unit-price').val());
    const availableQty = parseInt($('#qty-on-hand').val()); // දැනට ඉතිරිව ඇති ප්‍රමාණය
    const qty = parseInt($('#qty').val());

    // Basic Validation
    if (itemId == "" || isNaN(qty) || qty <= 0) {
        alert("කරුණාකර Item එකක් තෝරා නිවැරදි Qty එකක් ඇතුළත් කරන්න!");
        return;
    }

    // ඉතිරි ප්‍රමාණයට වඩා වැඩි Qty එකක් ඇතුළත් කළ නොහැක
    if (qty > availableQty) {
        alert("තොගයේ ඇති ප්‍රමාණයට වඩා වැඩි ප්‍රමාණයක් එකතු කළ නොහැක!");
        return;
    }

    // Cart එකේ කලින් මේ Item එක තිබුණද බලනවා
    let exists = false;
    let existingItem = null;

    for (let i = 0; i < orders.length; i++) {
        if (orders[i].code == itemId) {
            exists = true;
            existingItem = orders[i];
            break;
        }
    }

    if (exists) {
        // තිබුණා නම් Cart එකේ දැනට ඇති Qty එකට එකතු කර සාකල්‍ය Total Cost එක සදනවා
        existingItem.qty = existingItem.qty + qty;
        existingItem.totalCost = existingItem.qty * unitPrice;
    } else {
        // නැත්නම් අලුතින් Cart එකට දානවා
        const cartObj = {
            code: itemId,
            description: description,
            unitPrice: unitPrice,
            qty: qty,
            totalCost: unitPrice * qty
        };
        orders.push(cartObj);
    }

    renderCartTable();
    calculateTotal();
    clearItemInputs();
};

// 7. Render Cart Items in Table
const renderCartTable = () => {
    $('#cart-body').empty();

    orders.forEach((item) => {
        const row = `
            <tr>
                <td>${item.code}</td>
                <td>${item.description}</td>
                <td>${item.unitPrice}</td>
                <td>${item.qty}</td>
                <td>${item.totalCost}</td>
            </tr>
        `;
        $('#cart-body').append(row);
    });
};

// 8. Calculate Net Total
const calculateTotal = () => {
    let total = 0;
    for (let i = 0; i < orders.length; i++) {
        total += orders[i].totalCost;
    }
    $('#net-total').val(total);
};

// 9. Clear Item Input Fields
const clearItemInputs = () => {
    $('#item-id').val('');
    $('#description').val('');
    $('#unit-price').val('');
    $('#qty-on-hand').val('');
    $('#qty').val('');
};

// 10. Place Order & Update Item Quantities
const PlaceOrder = () => {
    const customerId = $('#customer-id').val();

    if (customerId == "") {
        alert("කරුණාකර Customer කෙනෙක් තෝරන්න!");
        return;
    }

    if (orders.length == 0) {
        alert("Cart එක හිස්ය! පළමුව Items එකතු කරන්න.");
        return;
    }

    const orderData = {
        customer: {
            customerId: customerId,
            name: $('#name').val(),
            address: $('#address').val(),
            salary: parseFloat($('#salary').val())
        },
        orderDate: new Date().toISOString().split('T')[0],
        totalCost: parseFloat($('#net-total').val()),
        items: orders
    };

    const firestore = firebase.firestore();

    // 1. Order එක Save කිරීම
    firestore.collection('orders').add(orderData).then(() => {
        
        // 2. Database එකේ සැබෑ Stock එකෙන් Cart එකේ තිබූ ප්‍රමාණය අඩු කිරීම
        orders.forEach((item) => {
            firestore.collection('items').doc(item.code).get().then((doc) => {
                if (doc.exists) {
                    const currentStock = doc.data().qtyOnHand;
                    const updatedStock = currentStock - item.qty;

                    firestore.collection('items').doc(item.code).update({
                        qtyOnHand: updatedStock
                    });
                }
            });
        });

        toastr.success('Order Placed Successfully!');
        resetAllFields();

    }).catch((error) => {
        toastr.error('Error Placing Order');
    });
};

// 11. Reset Form Fields
const resetAllFields = () => {
    orders = [];
    renderCartTable();
    $('#customer-id').val('');
    $('#name').val('');
    $('#address').val('');
    $('#salary').val('');
    clearItemInputs();
    $('#net-total').val('');
};