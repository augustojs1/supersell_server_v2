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
- [ ] REST API should use prefix: '/api/v1/'
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
- [ ] Database trigger to calculate product and user rating.
- [ ] Should feature a log system.
- [ ] Should use REDIS as a cache system.\*

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

- [ ] Users should be able to publish a product to sell.
- [ ] Users should be able to update their products.
- [ ] Users should be able to delete their products.
- [ ] Users should be able to read information about a given product.
- [ ] Users should be able to read all products in a category and paginate trough the results.
- [ ] Users should be able to search a product by their name.
- [ ] User should be able to see the first photo of a product and the product rating when returning a product list.
- [ ] User should be able to see all the product photos and rating when fetching a single product.
- [ ] Users should be able to see the first photo of the product when listing all products.
- [ ] Users should be able to sort the products by their price by ascending and descending order.
- [ ] Users should be able to see products sorted by: Best ratings, most sales, recent added...

### #Users

- [x] Create role based permission for admins and user.
- [x] User should be able to update their profile info.
- [ ] User should be able to update their profile avatar.
- [ ] Users should be able to read all their published product.
- [ ] Users should be able to filter their publish product by sold and not sold.
- [ ] Users should be able to see other users profile.
- [ ] User rating should be the average of their products rating.
- [ ] Users should be able to see their sales balance of sold products.

### #Files

- [ ] Users should be able to upload images of their products when is going to publish them.
- [ ] Users should be able to delete images of their published products.
- [ ] Users should be able to upload an avatar.

### #Wishlists

- [ ] Users should be able to add a product to their wishlist.
- [ ] Users should be able to read the products on their wishlist.
- [ ] Users should be able to remove a product from their wishlist.

### #Shopping Carts

- [ ] Users should be able to add a product to their shopping cart.
- [ ] Users should be able to delete a product from their shopping cart.
- [ ] Users should be able to read the products from their shopping cart.

### #OrderItem

- [ ] Users should be able to add a product and their quantity as order items.

### #Orders

- [ ] Users should be able to create an order with a product.
- [ ] Users should be able to read all the products they have an order.
- [ ] Users should be able to filter their orders based on if it is paid or not.
- [ ] Server admin should be able to change the status of a order.
- [ ] Order should have status of: PENDING_PAYMENT, PAID, CONFIRMED, SENT, ON_DELIVERY, DELIVERED.

### #DeliveryAdress

- [ ] Users should inform a delivery address with country, distric/region, neighborhood, street, house number and complement.

### #Payments

- [ ] Users should be able to pay for a order.
- [ ] Payment info should be stored in database.

### #Reviews

- [ ] Users should be able to create a review for a product.
- [ ] User should not be able to add more than one review to a product.
- [ ] Users should be able to delete a review for a product.
- [ ] Users should be able to see all the reviews for a product.
- [ ] Product rating should be the average of the reviews for that product.
- [ ] User rating should be the average of the reviews of his products.

### #Emails

- [ ] Users should confirm their account trough email.
- [ ] Users should reset their password trough email.
- [ ] Users should receive email for every status their order get.
