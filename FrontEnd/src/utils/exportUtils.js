// Export data to CSV format
export const exportToCSV = (data, filename = 'export.csv') => {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  // Get headers from first object
  const headers = Object.keys(data[0]);
  
  // Create CSV content
  const csvContent = [
    // Header row
    headers.join(','),
    // Data rows
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Handle values that contain commas, quotes, or newlines
        if (value === null || value === undefined) return '';
        const stringValue = String(value);
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      }).join(',')
    )
  ].join('\n');

  // Create blob and download
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Export customers to CSV with formatted data
export const exportCustomersToCSV = (customers) => {
  if (!customers || customers.length === 0) {
    console.warn('No customers to export');
    return;
  }

  // Format data for export
  const formattedData = customers.map(customer => ({
    'ID': customer.id,
    'Username': customer.username,
    'Full Name': customer.fullName,
    'Email': customer.email,
    'Phone': customer.phone || 'N/A',
    'Address': customer.address || 'N/A',
    'Role': customer.role,
    'Status': customer.active ? 'Active' : 'Inactive',
    'Created At': new Date(customer.createdAt).toLocaleDateString(),
    'Last Login': customer.lastLogin ? new Date(customer.lastLogin).toLocaleDateString() : 'Never',
  }));

  const timestamp = new Date().toISOString().split('T')[0];
  exportToCSV(formattedData, `customers_${timestamp}.csv`);
};

// Export to Excel format (using HTML table method)
export const exportToExcel = (data, filename = 'export.xlsx') => {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  const headers = Object.keys(data[0]);
  
  // Create HTML table
  let html = '<table><thead><tr>';
  headers.forEach(header => {
    html += `<th>${header}</th>`;
  });
  html += '</tr></thead><tbody>';
  
  data.forEach(row => {
    html += '<tr>';
    headers.forEach(header => {
      const value = row[header] || '';
      html += `<td>${value}</td>`;
    });
    html += '</tr>';
  });
  
  html += '</tbody></table>';

  // Create blob and download
  const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Export customers to Excel
export const exportCustomersToExcel = (customers) => {
  if (!customers || customers.length === 0) {
    console.warn('No customers to export');
    return;
  }

  // Format data for export
  const formattedData = customers.map(customer => ({
    'ID': customer.id,
    'Username': customer.username,
    'Full Name': customer.fullName,
    'Email': customer.email,
    'Phone': customer.phone || 'N/A',
    'Address': customer.address || 'N/A',
    'Role': customer.role,
    'Status': customer.active ? 'Active' : 'Inactive',
    'Created At': new Date(customer.createdAt).toLocaleDateString(),
    'Last Login': customer.lastLogin ? new Date(customer.lastLogin).toLocaleDateString() : 'Never',
  }));

  const timestamp = new Date().toISOString().split('T')[0];
  exportToExcel(formattedData, `customers_${timestamp}.xls`);
};

// Export categories to CSV
export const exportCategoriesToCSV = (categories) => {
  if (!categories || categories.length === 0) {
    console.warn('No categories to export');
    return;
  }

  const formattedData = categories.map(category => ({
    'ID': category.id,
    'Name': category.name,
    'Description': category.description || 'N/A',
    'Product Count': category.productCount || 0,
    'Status': category.isActive ? 'Active' : 'Inactive',
    'Created At': new Date(category.createdAt).toLocaleDateString(),
  }));

  const timestamp = new Date().toISOString().split('T')[0];
  exportToCSV(formattedData, `categories_${timestamp}.csv`);
};

// Export categories to Excel
export const exportCategoriesToExcel = (categories) => {
  if (!categories || categories.length === 0) {
    console.warn('No categories to export');
    return;
  }

  const formattedData = categories.map(category => ({
    'ID': category.id,
    'Name': category.name,
    'Description': category.description || 'N/A',
    'Product Count': category.productCount || 0,
    'Status': category.isActive ? 'Active' : 'Inactive',
    'Created At': new Date(category.createdAt).toLocaleDateString(),
  }));

  const timestamp = new Date().toISOString().split('T')[0];
  exportToExcel(formattedData, `categories_${timestamp}.xls`);
};

// Export products to CSV
export const exportProductsToCSV = (products) => {
  if (!products || products.length === 0) {
    console.warn('No products to export');
    return;
  }

  const formattedData = products.map(product => ({
    'ID': product.id,
    'Name': product.name,
    'Brand': product.brand || 'N/A',
    'Model': product.model || 'N/A',
    'Category': product.categoryName || 'N/A',
    'Price (VND)': product.price,
    'Stock Quantity': product.stockQuantity,
    'Description': product.description || 'N/A',
    'Specifications': product.specifications || 'N/A',
    'Status': product.isActive ? 'Active' : 'Inactive',
    'Created At': new Date(product.createdAt).toLocaleDateString(),
  }));

  const timestamp = new Date().toISOString().split('T')[0];
  exportToCSV(formattedData, `products_${timestamp}.csv`);
};

// Export products to Excel
export const exportProductsToExcel = (products) => {
  if (!products || products.length === 0) {
    console.warn('No products to export');
    return;
  }

  const formattedData = products.map(product => ({
    'ID': product.id,
    'Name': product.name,
    'Brand': product.brand || 'N/A',
    'Model': product.model || 'N/A',
    'Category': product.categoryName || 'N/A',
    'Price (VND)': product.price,
    'Stock Quantity': product.stockQuantity,
    'Description': product.description || 'N/A',
    'Specifications': product.specifications || 'N/A',
    'Status': product.isActive ? 'Active' : 'Inactive',
    'Created At': new Date(product.createdAt).toLocaleDateString(),
  }));

  const timestamp = new Date().toISOString().split('T')[0];
  exportToExcel(formattedData, `products_${timestamp}.xls`);
};

// Export orders to CSV
export const exportOrdersToCSV = (orders) => {
  if (!orders || orders.length === 0) {
    console.warn('No orders to export');
    return;
  }

  const formattedData = orders.map(order => ({
    'Mã đơn hàng': order.orderNumber,
    'Khách hàng': order.username,
    'Email': order.userEmail,
    'Số điện thoại': order.phoneNumber,
    'Tổng tiền (VND)': order.totalAmount,
    'Trạng thái': getOrderStatusText(order.status),
    'Địa chỉ giao hàng': order.shippingAddress || 'N/A',
    'Ngày tạo': new Date(order.createdAt).toLocaleDateString('vi-VN'),
    'Ghi chú': order.notes || 'N/A'
  }));

  const timestamp = new Date().toISOString().split('T')[0];
  exportToCSV(formattedData, `orders_${timestamp}.csv`);
};

// Export orders to Excel
export const exportOrdersToExcel = (orders) => {
  if (!orders || orders.length === 0) {
    console.warn('No orders to export');
    return;
  }

  const formattedData = orders.map(order => ({
    'Mã đơn hàng': order.orderNumber,
    'Khách hàng': order.username,
    'Email': order.userEmail,
    'Số điện thoại': order.phoneNumber,
    'Tổng tiền (VND)': order.totalAmount,
    'Trạng thái': getOrderStatusText(order.status),
    'Địa chỉ giao hàng': order.shippingAddress || 'N/A',
    'Ngày tạo': new Date(order.createdAt).toLocaleDateString('vi-VN'),
    'Ghi chú': order.notes || 'N/A'
  }));

  const timestamp = new Date().toISOString().split('T')[0];
  exportToExcel(formattedData, `orders_${timestamp}.xls`);
};

// Helper function to get order status text in Vietnamese
const getOrderStatusText = (status) => {
  const statusMap = {
    'PENDING': 'Chờ xác nhận',
    'CONFIRMED': 'Đã xác nhận',
    'PROCESSING': 'Đang xử lý',
    'SHIPPED': 'Đã giao vận',
    'DELIVERED': 'Đã giao hàng',
    'CANCELLED': 'Đã hủy'
  };
  return statusMap[status] || status;
};