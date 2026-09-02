let selectedItemId = undefined;

const createItem = () => {
    const tempItem = {
        description: $('#description').val(),
        qtyOnHand: parseInt($('#qty-on-hand').val()) || 0,
        unitPrice: parseFloat($('#unit-price').val()) || 0,
    };

    const database = firebase.firestore();
    database.collection('items')
        .add(tempItem)
        .then(() => {
            toastr.success('Item Created Successfully', 'Success');
            clearFields();
            loadItems();
        })
        .catch((error) => console.error("Error creating item: ", error));
};

const loadItems = () => {
    $('#table-body').empty();

    const firestore = firebase.firestore();
    firestore.collection('items').get()
        .then((result) => {
            result.forEach((record) => {
                const data = record.data();
                const row = `
                    <tr>
                        <td>${record.id}</td>
                        <td>${data.description || ''}</td>
                        <td>${data.qtyOnHand || 0}</td>
                        <td>${data.unitPrice || 0}</td>
                        <td>
                            <button class="btn btn-danger btn-sm" onclick="deleteData('${record.id}')">Delete</button>
                            <button class="btn btn-success btn-sm" onclick="updateData('${record.id}')">Update</button>
                        </td>
                    </tr>
                `;
                $('#table-body').append(row);
            });
        })
        .catch((error) => console.error("Error loading items: ", error));
};

const updateData = (id) => {
    selectedItemId = id;
    const firestore = firebase.firestore();
    firestore.collection('items').doc(id).get()
        .then((response) => {
            if (response.exists) {
                const data = response.data();
                $('#description').val(data.description);
                $('#qty-on-hand').val(data.qtyOnHand);
                $('#unit-price').val(data.unitPrice);
            }
        });
};

// HTML button onclick ekata updateItem kyl name eka badha gaththa
const updateItem = () => {
    if (selectedItemId) {
        const firestore = firebase.firestore();
        firestore.collection('items').doc(selectedItemId)
            .update({
                description: $('#description').val(),
                qtyOnHand: parseInt($('#qty-on-hand').val()) || 0,
                unitPrice: parseFloat($('#unit-price').val()) || 0,
            })
            .then(() => {
                toastr.success('Item Updated Successfully', 'Success');
                selectedItemId = undefined;
                clearFields();
                loadItems();
            })
            .catch((error) => console.error("Error updating item: ", error));
    } else {
        alert("කරුණාකර Table එකෙන් Update කිරීමට Item එකක් තෝරන්න!");
    }
};

const deleteData = (id) => {
    if (confirm('Are you sure you want to delete this item?')) {
        const firestore = firebase.firestore();
        firestore.collection('items').doc(id).delete()
            .then(() => {
                toastr.success('Item Deleted', 'Success');
                loadItems();
            })
            .catch((error) => console.error("Error deleting item: ", error));
    }
};

const clearFields = () => {
    $('#description').val('');
    $('#qty-on-hand').val('');
    $('#unit-price').val('');
};