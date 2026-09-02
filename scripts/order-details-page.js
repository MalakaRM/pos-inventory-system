const loadData = () => {
    // 1. URL එකෙන් Order ID එක ලබා ගැනීම
    const queryParameter = new URLSearchParams(window.location.search);
    const id = queryParameter.get('id');

    // ID එක නැත්නම් Function එක නතර කිරීම
    if (!id) {
        alert("Order ID එකක් හමු නොවුණි!");
        return;
    }

    const firestore = firebase.firestore();

    // 2. Firestore එකෙන් අදාළ Order Document එක Fetch කිරීම
    firestore.collection('orders').doc(id).get().then((response) => {
        if (response.exists) {
            const data = response.data();

            // A. Order Information Table එක පිරවීම
            const orderRow = `
                <tr>
                    <td>${response.id}</td>
                    <td>${data.orderDate}</td>
                    <td>${data.totalCost}</td>
                </tr>
            `;
            $('#order-details-table-body').append(orderRow);

            // B. Customer Details Table එක පිරවීම
            const customerRow = `
                <tr>
                    <td>${data.customer.customerId}</td>
                    <td>${data.customer.name}</td>
                    <td>${data.customer.address}</td>
                    <td>${data.customer.salary}</td>
                </tr>
            `;
            $('#customer-details-table-body').append(customerRow);

            // C. Item Details Table එක (Array Loop එකකින්) පිරවීම
            data.items.forEach((record) => {
                const itemRow = `
                    <tr>
                        <td>${record.code}</td>
                        <td>${record.description}</td>
                        <td>${record.qty}</td>
                        <td>${record.unitPrice}</td>
                        <td>${record.totalCost}</td>
                    </tr>
                `;
                $('#items-table-body').append(itemRow);
            });

            // 3. Page එක Load වී අවසන් වූ පසු Print Dialog එක Open කිරීම
            setTimeout(() => {
                window.print();
            }, 500);

        } else {
            alert("අදාළ Order එක හමු නොවීය!");
        }
    }).catch((error) => {
        console.error("Error loading order details:", error);
    });
};