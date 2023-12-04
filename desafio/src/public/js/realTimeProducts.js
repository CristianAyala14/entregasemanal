const socket = io();
socket.on("products_actualizados", (updatedProducts)=>{
    // Obtener la lista en el DOM por su identificador
    const productList = document.getElementById('productList');
    // Limpiar la lista actual
    productList.innerHTML = '';
    // Iterar sobre los productos actualizados y agregarlos a la lista
    updatedProducts.forEach(product => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <strong>Titulo:</strong>${product.title}<br>
            <strong>Descripcion:</strong>${product.description}<br>
            <strong>Codigo:</strong>${product.code}<br>
            <strong>Precio:</strong>${product.price}<br>
            <strong>Stock:</strong>${product.stock}<br>
            <strong>Categoria:</strong>${product.category}<br>
            <br>
        `;
        productList.appendChild(listItem);
    });    
})