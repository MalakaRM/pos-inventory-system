# 🛒 Smart POS & Inventory Management System

A web-based Point of Sale (POS) and Inventory Management System designed for internal store operations, cashiers, and admins. Built with a responsive Bootstrap 5 interface and powered by Firebase Firestore for real-time data persistence.

---

## 🌟 Key Features

* **🔐 Authentication & Security**
  * Secure Login and Registration system powered by **Firebase Auth**.
* **📊 Analytics Dashboard**
  * Dynamic counts for Total Customers, Items, and Orders fetched live from Firestore.
  * Quick navigation shortcuts for cashier efficiency.
* **📦 Inventory & Customer Management**
  * Complete CRUD operations for Customers and Stock Items.
* **🛍️ Place Order Engine**
  * Dynamic cart management with duplicate prevention.
  * Stock validation before completing the checkout.
  * Automatic inventory deduction upon order confirmation.
* **🧾 Order History & Invoicing**
  * Comprehensive breakdown of past transactions with printable receipt view.

---

## 🛠️ Tech Stack

* **Frontend:** HTML5, CSS3, Bootstrap 5, JavaScript (ES6+), jQuery
* **Backend / Database:** Firebase Firestore (NoSQL), Firebase Authentication
* **Architecture:** Modular Client-Side Architecture

---

## 📁 Project Structure

```text
smart-pos-system/
├── index.html / login.html    # Login & Authentication Page
├── register.html               # New User Registration Page
├── dashboard.html              # Main Dashboard Page
├── customer.html               # Customer Management View
├── items.html                  # Item & Inventory Management View
├── orders.html                 # Order History View
├── place-order.html            # Checkout & Cart Engine
├── styles/                     # Custom CSS Stylesheets
└── scripts/                    # Application Logic & Firebase Configuration
