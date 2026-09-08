📦 Local Warehouse App

Local Warehouse App is a React Native-based warehouse management system designed to simplify and centralize daily warehouse operations.

The application provides a single platform for managing products, inventory, suppliers, customers, purchase orders, sales orders, and operational reports. It helps warehouse users maintain accurate stock information, manage purchasing and sales activities, and keep track of day-to-day inventory operations.

The project focuses on building a practical warehouse workflow that connects inventory, purchasing, suppliers, customers, and sales into one centralized system.

🎯 Why This Project?

Managing warehouse operations manually can make it difficult to maintain accurate inventory levels, track purchases and sales, and keep supplier and customer information organized.

The Local Warehouse App addresses this by providing a centralized system where users can manage warehouse data and monitor stock movement from a single application.

The project demonstrates how a mobile application can combine CRUD operations, inventory management, order processing, supplier and customer management, and reporting into one complete business-management solution.

✨ Features

* 📦 Product management
* ➕ Add new products
* ✏️ Update product information
* 🗑️ Delete products
* 🔢 Track inventory and stock levels
* 🔄 Manage stock movement
* 🚚 Supplier management
* 👥 Customer management
* 🛒 Purchase order management
* 🧾 Sales order management
* 📊 Warehouse reports
* 🔍 Search and manage warehouse records
* 📱 Responsive React Native UI
* 🔐 User authentication
* ⚡ Centralized warehouse management

🔄 Warehouse Workflow

Add Products
     ↓
Manage Inventory
     ↓
Purchase Stock
     ↓
Receive Stock
     ↓
Update Inventory
     ↓
Process Sales
     ↓
Reduce Stock
     ↓
Generate Reports

Purchase Workflow

Create Purchase Order
        ↓
Select Supplier
        ↓
Add Products & Quantity
        ↓
Confirm Purchase
        ↓
Receive Stock
        ↓
Update Inventory

Sales Workflow

Create Sales Order
        ↓
Select Customer
        ↓
Add Products & Quantity
        ↓
Confirm Sale
        ↓
Reduce Inventory
        ↓
Complete Order

🧩 Main Modules

📦 Product Management

Users can manage warehouse products through complete CRUD operations:

Create → Read → Update → Delete

Product information can include:

* Product name
* SKU / product code
* Category
* Price
* Quantity
* Stock status
* Product description

🔢 Inventory Management

The inventory module provides a centralized view of available stock.

Users can monitor:

* Current stock
* Stock additions
* Stock reductions
* Available quantity
* Low-stock items
* Product availability

Inventory changes can be associated with purchasing and sales operations.

🚚 Supplier Management

Users can maintain supplier information and associate suppliers with purchase orders.

Supplier records can contain:

* Supplier name
* Contact information
* Email
* Phone number
* Address
* Additional details

👥 Customer Management

The customer module allows users to maintain customer information and associate customers with sales orders.

🛒 Purchase Orders

Purchase orders allow warehouse users to record incoming stock from suppliers.

Users can:

* Create purchase orders
* Select suppliers
* Add products
* Specify quantities
* Track purchase status
* Update inventory after receiving stock

🧾 Sales Orders

Sales orders help manage outgoing inventory and customer purchases.

Users can:

* Create sales orders
* Select customers
* Add products
* Specify quantities
* Track order status
* Update inventory after sales

📊 Reports

The reporting module provides an overview of warehouse operations and helps users understand important business information such as inventory, purchases, and sales.

🏗️ Application Architecture

The application follows a structured architecture that separates the mobile interface, application logic, API communication, and backend data management.

React Native UI
       ↓
Screens / Components
       ↓
Services / API Layer
       ↓
Node.js & Express.js
       ↓
MongoDB

This separation keeps the application modular and makes individual warehouse modules easier to maintain and manage.

🛠️ Tech Stack

React Native • JavaScript • React Hooks • Axios • AsyncStorage • Node.js • Express.js • MongoDB • Mongoose • JWT • bcryptjs

📁 Project Structure

LocalWarehouse/
 → src/ • screens/ • components/ • services/ • navigation/ • models/ • utils/
 → assets/ • android/ • ios/ • package.json • README.md

🚀 Getting Started

Prerequisites

Make sure you have the following installed:

* Node.js
* npm
* React Native development environment
* Android Studio / Xcode
* Android Emulator or physical device
* MongoDB
* Backend server

Installation

Clone the repository:

git clone <your-repository-url>

Navigate to the project:

cd LocalWarehouse

Install dependencies:

npm install

Start the Metro server:

npm start

Run the Android application:

npm run android

For iOS:

npm run ios

🔌 Backend Configuration

The application communicates with a Node.js and Express.js backend.

Configure the API base URL according to your development environment.

For an Android emulator, a backend running on the development machine can typically be accessed using:

http://10.0.2.2:<PORT>

For a physical Android device, use the local IP address of the machine running the backend.

🔒 Authentication & Security

The application uses token-based authentication to protect user-specific operations.

JWT can be used to:

* Authenticate users
* Protect API endpoints
* Identify the logged-in user
* Restrict access to warehouse operations
* Secure product, inventory, supplier, customer, and order data

Passwords are securely hashed on the backend rather than being stored as plain text.

💡 Real-World Use Case

A local warehouse receives a new shipment of products from a supplier.

The warehouse user can:

1. Select the supplier.
2. Create a purchase order.
3. Add the incoming products and quantities.
4. Confirm the purchase.
5. Receive the stock.
6. Update the inventory.
7. Process customer sales.
8. Automatically reflect outgoing stock.
9. Review warehouse reports.

This creates a complete supplier → purchase → inventory → sales → customer workflow.

🎯 Project Goals

The main goals of this project are:

* Build a practical warehouse management application.
* Centralize daily warehouse operations.
* Implement product and inventory CRUD functionality.
* Manage suppliers and customers.
* Implement purchase and sales order workflows.
* Track stock movement.
* Generate operational reports.
* Develop secure user authentication.
* Integrate a React Native application with a backend API.
* Work with MongoDB for persistent business data.
* Build a complete real-world business application for a development portfolio.

📌 Portfolio Highlights

This project demonstrates practical experience with:

React Native • JavaScript • Mobile UI Development • Authentication • CRUD Operations • REST APIs • Axios • AsyncStorage • Node.js • Express.js • MongoDB • Mongoose • JWT • bcryptjs • Inventory Management • Product Management • Supplier Management • Customer Management • Purchase Orders • Sales Orders • Business Reports
