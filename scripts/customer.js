let selectedCustomerId = undefined;

// 1. Create New Customer
const createCustomer = () => {
    const tempCustomer = {
        name: $('#name').val().trim(),
        address: $('#address').val().trim(),
        salary: parseFloat($('#salary').val()) || 0,
    };

    if (!tempCustomer.name || !tempCustomer.address) {
        alert("කරුණාකර Name සහ Address ඇතුළත් කරන්න!");
        return;
    }

    const database = firebase.firestore();
    database.collection('customers')
        .add(tempCustomer)
        .then(() => {
            toastr.success('Customer Created Successfully', 'Success');
            clearFields();
            loadCustomer();
        })
        .catch((error) => console.error("Error creating customer: ", error));
};

// 2. Fetch All Customers
const loadCustomer = () => {
    $('#table-body').empty();

    const firestore = firebase.firestore();
    firestore.collection('customers').get()
        .then((result) => {
            result.forEach((record) => {
                const data = record.data();
                const row = `
                    <tr>
                        <td><strong>${record.id}</strong></td>
                        <td>${data.name || ''}</td>
                        <td>${data.address || ''}</td>
                        <td>${data.salary || 0}</td>
                        <td>
                            <button class="btn btn-danger btn-sm" onclick="deleteData('${record.id}')">Delete</button>
                            <button class="btn btn-success btn-sm" onclick="updateData('${record.id}')">Update</button>
                        </td>
                    </tr>
                `;
                $('#table-body').append(row);
            });
        })
        .catch((error) => console.error("Error loading customers: ", error));
};

// 3. Select Data for Update
const updateData = (id) => {
    selectedCustomerId = id;
    const firestore = firebase.firestore();
    firestore.collection('customers').doc(id).get()
        .then((response) => {
            if (response.exists) {
                const data = response.data();
                $('#name').val(data.name);
                $('#address').val(data.address);
                $('#salary').val(data.salary);
            }
        })
        .catch((error) => console.error("Error fetching customer: ", error));
};

// 4. Update Selected Customer Record
const updateRecord = () => {
    if (selectedCustomerId) {
        const firestore = firebase.firestore();
        firestore.collection('customers').doc(selectedCustomerId)
            .update({
                name: $('#name').val().trim(),
                address: $('#address').val().trim(),
                salary: parseFloat($('#salary').val()) || 0,
            })
            .then(() => {
                toastr.success('Customer Updated Successfully', 'Success');
                selectedCustomerId = undefined;
                clearFields();
                loadCustomer();
            })
            .catch((error) => console.error("Error updating customer: ", error));
    } else {
        alert("කරුණාකර Table එකෙන් Update කිරීමට Customer කෙනෙක් තෝරන්න!");
    }
};

// 5. Delete Customer Record
const deleteData = (id) => {
    if (confirm('Are you sure you want to delete this customer?')) {
        const firestore = firebase.firestore();
        firestore.collection('customers').doc(id).delete()
            .then(() => {
                toastr.success('Customer Deleted', 'Success');
                loadCustomer();
            })
            .catch((error) => console.error("Error deleting customer: ", error));
    }
};

// 6. Clear Form Fields
const clearFields = () => {
    $('#name').val('');
    $('#address').val('');
    $('#salary').val('');
};