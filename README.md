Spoon Food Delivery App
Welcome to the Spoon Food Delivery App repository! This repository contains the source code and documentation for a full-stack food delivery application built using the MERN (MongoDB, Express.js, ReactJS, Node.js) stack. The app enables users to explore a variety of dishes and conveniently place orders for delivery from the Spoon restaurant.

##Spoon Food Delivery App

###Features
The Spoon Food Delivery App offers the following features:

1.User Authentication: Users can create an account, log in, and manage their profile.
2.Restaurant Menu: Users can browse the menu offered by the Spoon restaurant, view dish details, including descriptions, prices, and images.
3.Cart Management: Users can add items to their cart, modify quantities, and remove items before placing an order.
4.Order Placement: Users can place orders for their selected dishes and specify delivery details like address.
5.Real-time Order Tracking: Users can track their orders in real-time, from order confirmation to delivery.
6.Order History: Users can view their past orders, check order details, and reorder favorite items easily.
7.Restaurant Dashboard: Restaurant owners can manage their menu, view incoming orders, and update order status.
8.Admin Dashboard: Administrators have access to an admin dashboard to manage restaurants, users, and app settings.
9.Backend User: A Backend user can also access the administrators page and do the necessity changes but cant access the restaurant open or closed function.

###Technologies Used
The Spoon Food Delivery App is built using the following technologies:

Frontend: ReactJS, HTML, CSS, JavaScript
Backend: Node.js, Express.js
Database: MongoDB
Authentication: JSON Web Tokens (JWT)
Real-time Updates: Socket.io
Payment Integration: Stripe API
Maps and Geocoding: Google Maps API
Getting Started
To set up the Spoon Food Delivery App on your local machine, follow the steps below:

Clone the repository for spoon-backend: git clone https://github.com/itobuz-steps/spoon-backend.git
Clone the repository for spoon-frontend: git clone https://github.com/itobuz-steps/spoon-frontend.git
CLone the repository for spoon-admin-dashboard: git clone https://github.com/itobuz-steps/Spoon-Admin-Dashboard.git
Install the dependencies for the backend: npm install
Install the dependencies for the frontend: npm install
Install the dependencies for the admin-dashboard: npm install
Set up the required environment variables:
Create a .env file in the root of the backend directory based on the provided .env.example file.
Update the values of the environment variables with your own configuration.
Start the backend server: npm start (from the spoon-backend directory)
Start the frontend development server: npm start (from the spoon-frontend directory)
Start the admin-dashboard development server: npm start (from the spoon-admin-dashboard directory)

Access the app by visiting http://localhost:3000 in your web browser.

###Folder Structure
The repository follows a specific folder structure:

Spoon-frontend and Spoon-admin-dashboard: Contains the frontend codebase built with ReactJS.
Spoon-backend: Contains the backend codebase built with Node.js and Express.js.

Contribution Guidelines
Contributions to the Spoon Food Delivery App are welcome! If you'd like to contribute, please follow these guidelines:

Fork the repository on GitHub.
Create a new branch with a descriptive name: git checkout -b feature/your-feature-name.
Make your desired changes to the codebase.
Test your changes thoroughly.
Commit your changes with a clear and descriptive commit message: `git commit -m "Add
