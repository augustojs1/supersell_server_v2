<h1 align="center"> 
	SuperSell Server V2
</h1>

<h3 align="center"> 
	Non-Functional Requirements
</h3>

- [ ] SuperSell Server should be developed using the following technologies: Node.js, Nest.js, TypeScript, MySQL, Drizzle and Docker.
- [ ] Supersell External Services should be a microservice responsible for dealing with emailing, payment and delivery logistics.
- [ ] Supersell Server should comunicate with Supersell External Services via Event Driven Architecture pattern.
- [ ] Supersell Server should use Kafka localy as message broker.
- [x] REST API should use prefix: '/api/v1/'
- [ ] Should feature a seeder for data.
- [ ] Docker container for the database.
- [ ] Docker container for the application.
- [ ] Docker container for Kafka locally.
- [ ] Create Github documentation.
- [ ] Create Swagger REST API documentation.
- [ ] Implement security configuration: SQL Injection, XSS Protection, Security Headers, Rate limiting, HPP & CORS etc.
- [ ] Should include unit and integration tests.
- [ ] Implement server configuration: Nginx, SSL, Domain, PM2 etc.
- [ ] Create basic CI/CD and Github Actions pipeline.
- [ ] Server should be deployed in production to Amazon AWS EC2 and later to AWS ECS.
- [ ] Database should be deployed in production to AWS RDS.
- [ ] Server should use in production AWS S3 to store static files such as images and etc.
- [ ] Server should use in production AWS SQS as a message broker.
- [ ] Server should use in production AWS SES as an emailing service.
- [x] Database trigger to calculate product and user rating.
- [ ] Should feature a log system.

<h3 align="center"> 
	Functional Requirements
</h3>

### #Authentication

- [x] Users should be able to sign up.
- [x] Users should be able to sign in.
- [ ] Users should be able to reset their password trough email.

### #Departments

- [x] Departments can have a parent department.
- [x] Server admin should be able to create a new product department.
- [x] Server admin and users should be able to read all the existent department.
- [x] Server admin should be able to update an existent department.
- [x] Server admin should be able to delete an existent department.

### #Products

- [x] Users should be able to publish a product to sell.
- [x] Users should be able to update their products.
- [x] Users should be able to delete their products.
- [x] Users should be able to read all products in a category and paginate trough the results.
- [ ] Users should be able to search a product by their name. (MELHORAR PERF.)
- [x] User should be able to see the first photo of a product and the product rating when returning a product list.
- [x] User should be able to read all the product photos and rating when fetching a single product.
- [x] Users should be able to sort the products by their price by ascending and descending order.
- [x] Users should be able to see products sorted by: Best ratings, most sales, recent added...

### #Users

- [x] Create role based permission for admins and user.
- [x] User should be able to update their profile info.
- [x] User should be able to update their profile avatar.
- [ ] User should be able to update their profile avatar to AWS.
- [x] Users should be able to read all their published product.
- [x] User should be able to read all published products from another user.
- [x] Users should be able to see other users profile.
- [x] User rating should be the average of their products rating.

### #Wishlists

- [x] Users should be able to add a product to their wishlist.
- [x] Users should be able to read the products on their wishlist.
- [x] Users should be able to remove a product from their wishlist.

### #Shopping Carts

- [x] Users should be able to add a product to their shopping cart.
- [x] User shopping cart total should be the total of value of it's items.
- [x] Users should be able to delete a product from their shopping cart.
  - [x] Shopping cart item price should be deducted from shopping cart total price.
- [x] Users should be able to read the products from their shopping cart.
- [x] Users should be able to edit the shopping cart item quantity.
- [x] User should be able to checkout from their shopping cart.
- [ ] User can not add product to shopping cart if quantity surpassess the product quantity ammount.
- [ ] Product quantity should decrease when successfully checkout.

### #OrderItem

- [x] Users should be able to add a product and their quantity as order items.
- [x] Order item should have a delivery address.
- [x] Order item should have a billing address.

### #Orders

- [x] Users should be able to create an order with a product.
- [x] Users should be able to read all the products they have an order.
- [x] Users should be able to read orders for all of their products.
- [ ] Server admin should be able to change the status of a order.
- [x] Order should have status of: PENDING_PAYMENT, FAILED_PAYMENT, PAID, SENT, ON_DELIVERY, DELIVERED.
- [x] Users should be able to filter their orders by status.
- [x] Users should be able to filter their sales by status.

### #Address

- [x] Users should inform a delivery address with country, distric/region, neighborhood, street, house number, alias and complement.
- [x] Address should have 4 different types: PERSONAL_ADDRESS, DELIVERY_ADDRESS, BILLING_ADDRESS and DELIVERY_AND_BILLING_ADDRESS
- [x] User should only have one personall address.
- [x] User should be able to update an existing address.
- [x] User should be able to delete an address.

### #Reviews

- [x] Users should be able to create a review for a product.
- [x] User should not be able to add more than one review to a product.
- [x] Users should be able to delete a review for a product.
- [x] Users should be able to see all the reviews for a product.
- [x] Product rating should be the average of the reviews for that product.
- [x] User rating should be the average of the reviews of their products.

### #Payments

- [ ] Users should be able to pay for a order.
- [ ] Payment info should be stored in database.
- [ ] Increment sales ammount after successfully payment for a order.

### #Emails

- [ ] Users should reset their password trough email.
- [ ] Users should receive email for every status their order get.
