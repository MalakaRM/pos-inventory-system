const loadData = () => {
    $('#order-table-body').empty();

    const firestore = firebase.firestore();
    firestore.collection('orders').get()
        .then((result) => {
            result.forEach((record) => {
                const data = record.data();
                // Customer details safe access
                const customerName = data.customer ? data.customer.name : 'N/A';
                
                const row = `
                    <tr>
                        <td><strong>${record.id}</strong></td>
                        <td>${customerName}</td>
                        <td>${data.orderDate || ''}</td>
                        <td>${data.totalCost || 0}</td>
                        <td>
                            <button class="btn btn-dark btn-sm" onclick="printData('${record.id}')">Print</button>
                        </td>
                    </tr>
                `;
                $('#order-table-body').append(row);
            });
        })
        .catch((error) => console.error("Error loading orders: ", error));
};

const printData = (id) => {
    window.open(`order-details-page.html?id=${id}`);
};