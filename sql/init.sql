-- Database tables
-- users
CREATE TABLE users (
	id CHAR(26) PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  username VARCHAR(30) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- profiles
CREATE TABLE profiles (
	id CHAR(26) PRIMARY KEY,
  user_id CHAR(26) NOT NULL,
  average_rating FLOAT(3,2) DEFAULT 0.00 CHECK (average_rating >= 0.00 AND average_rating <= 5.00),
  avatar_url TEXT DEFAULT NULL,
  phone_number VARCHAR(45) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- departments
CREATE TABLE departments (
  id CHAR(26) PRIMARY KEY,
  parent_department_id CHAR(26),
  name VARCHAR(100) UNIQUE NOT NULL,
  description VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (parent_department_id) REFERENCES departments(id) ON DELETE CASCADE
);

-- products
CREATE TABLE products (
	id CHAR(26) PRIMARY KEY,
  user_id CHAR(26) NOT NULL,
  department_id CHAR(26) NOT NULL,
  name VARCHAR(50) UNIQUE NOT NULL,
	sku VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(13,2) NOT NULL,
  quantity INT NOT NULL,
  slug VARCHAR(255) NOT NULL,
	sales INT DEFAULT 0,
	thumbnail_image_url TEXT NOT NULL,
  is_in_stock BOOLEAN DEFAULT 1,
  average_rating DECIMAL(3,2) DEFAULT 0.00 CHECK (average_rating >= 0.0 AND average_rating <= 5.00),
  is_used BOOLEAN NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (department_id) REFERENCES departments(id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

ALTER TABLE
	products 
ADD FULLTEXT(name);

-- products_images
CREATE TABLE products_images (
	id CHAR(26) PRIMARY KEY,
  product_id CHAR(26) NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- wishlists
CREATE TABLE wishlists (
	product_id CHAR(26) NOT NULL,
	user_id CHAR(26) NOT NULL,
	UNIQUE (user_id, product_id),
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	
	FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- reviews
CREATE TABLE reviews (
	id CHAR(26) PRIMARY KEY,
	user_id CHAR(26),
	product_id CHAR(26) NOT NULL,
	content TEXT NOT NULL,
	rating DOUBLE(3,2) NOT NULL CHECK (rating >= 0.00 AND rating <= 5.00),
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	
	FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
	FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- shopping_carts
CREATE TABLE shopping_carts (
	id CHAR(26) PRIMARY KEY,
	user_id CHAR(26) NOT NULL,
	total_price DECIMAL(13,2) DEFAULT 0.0,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	
	FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- shopping cart item
CREATE TABLE shopping_cart_item (
	id CHAR(26) PRIMARY KEY,
	shopping_cart_id CHAR(26) NOT NULL,
	product_id CHAR(26) NOT NULL,
	price DECIMAL(13,2) NOT NULL,
	quantity INT NOT NULL,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

	FOREIGN KEY (shopping_cart_id) REFERENCES shopping_carts(id) ON DELETE CASCADE,
	FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- countries
CREATE TABLE countries (
	code CHAR(2) PRIMARY KEY,
	name VARCHAR(50) NOT NULL
);

-- address
CREATE TABLE address (
	id VARCHAR(26) PRIMARY KEY,
	user_id VARCHAR(26) NOT NULL,
	country_code VARCHAR(26) NOT NULL,
	`type` ENUM('PERSONAL_ADDRESS', 'DELIVERY_ADDRESS', 'BILLING_ADDRESS', 'DELIVERY_AND_BILLING_ADDRESS') NOT NULL,
	alias VARCHAR(50),
	complement VARCHAR(50),
	`number` VARCHAR(50) NOT NULL,
	street VARCHAR(50) NOT NULL,
	neighborhood VARCHAR(50) NOT NULL,
	district VARCHAR(50) NOT NULL,
	postalcode VARCHAR(50) NOT NULL,
	city VARCHAR(50) NOT NULL,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	
	FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
	FOREIGN KEY (country_code) REFERENCES countries(code) ON DELETE CASCADE
);

-- orders
CREATE TABLE orders (
	id VARCHAR(26) PRIMARY KEY,
	customer_id VARCHAR(26),
	seller_id VARCHAR(26),
	delivery_address_id VARCHAR(26),
	status ENUM('PENDING_PAYMENT', 'FAILED_PAYMENT', 'PAID', 'SENT', 'ON_DELIVERY', 'DELIVERED', 'CANCELLED') NOT NULL,
	total_price DECIMAL(13,2) NOT NULL,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	
	FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE SET NULL,
	FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE SET NULL,
	FOREIGN KEY (delivery_address_id) REFERENCES address(id) ON DELETE SET NULL
);

-- order_items
CREATE TABLE order_items (
	id VARCHAR(26) PRIMARY KEY,
	product_id VARCHAR(26),
	order_id VARCHAR(26),
	quantity INT NOT NULL,
	price DECIMAL(13,2) NOT NULL,
	subtotal_price DECIMAL(13,2) NOT NULL,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	
	FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
	FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL
);

-- order_payments
CREATE TABLE order_payments (
  id VARCHAR(26) PRIMARY KEY,
  order_id VARCHAR(26),
  amount DECIMAL(13,2) NOT NULL,
  code VARCHAR(100) NOT NULL,
  method VARCHAR(100) NOT NULL,
  status ENUM('SUCCESS', 'FAIL') NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL
);

-- countries seed
INSERT INTO countries (name, code) VALUES
('Afghanistan', 'AF'),
('Albania', 'AL'),
('Algeria', 'DZ'),
('American Samoa', 'AS'),
('Andorra', 'AD'),
('Angola', 'AO'),
('Anguilla', 'AI'),
('Antarctica', 'AQ'),
('Antigua and Barbuda', 'AG'),
('Argentina', 'AR'),
('Armenia', 'AM'),
('Aruba', 'AW'),
('Asia/Pacific Region', 'AP'),
('Australia', 'AU'),
('Austria', 'AT'),
('Azerbaijan', 'AZ'),
('Bahamas', 'BS'),
('Bahrain', 'BH'),
('Bangladesh', 'BD'),
('Barbados', 'BB'),
('Belarus', 'BY'),
('Belgium', 'BE'),
('Belize', 'BZ'),
('Benin', 'BJ'),
('Bermuda', 'BM'),
('Bhutan', 'BT'),
('Bolivia', 'BO'),
('Bonaire, Sint Eustatius and Saba', 'BQ'),
('Bosnia and Herzegovina', 'BA'),
('Botswana', 'BW'),
('Bouvet Island', 'BV'),
('Brazil', 'BR'),
('British Indian Ocean Territory', 'IO'),
('Brunei Darussalam', 'BN'),
('Bulgaria', 'BG'),
('Burkina Faso', 'BF'),
('Burundi', 'BI'),
('Cambodia', 'KH'),
('Cameroon', 'CM'),
('Canada', 'CA'),
('Cape Verde', 'CV'),
('Cayman Islands', 'KY'),
('Central African Republic', 'CF'),
('Chad', 'TD'),
('Chile', 'CL'),
('China', 'CN'),
('Christmas Island', 'CX'),
('Cocos (Keeling) Islands', 'CC'),
('Colombia', 'CO'),
('Comoros', 'KM'),
('Congo', 'CG'),
('Congo, The Democratic Republic of the', 'CD'),
('Cook Islands', 'CK'),
('Costa Rica', 'CR'),
('Croatia', 'HR'),
('Cuba', 'CU'),
('Curaçao', 'CW'),
('Cyprus', 'CY'),
('Czech Republic', 'CZ'),
('Côte d Ivoire', 'CI'),
('Denmark', 'DK'),
('Djibouti', 'DJ'),
('Dominica', 'DM'),
('Dominican Republic', 'DO'),
('Ecuador', 'EC'),
('Egypt', 'EG'),
('El Salvador', 'SV'),
('Equatorial Guinea', 'GQ'),
('Eritrea', 'ER'),
('Estonia', 'EE'),
('Ethiopia', 'ET'),
('Falkland Islands (Malvinas)', 'FK'),
('Faroe Islands', 'FO'),
('Fiji', 'FJ'),
('Finland', 'FI'),
('France', 'FR'),
('French Guiana', 'GF'),
('French Polynesia', 'PF'),
('French Southern Territories', 'TF'),
('Gabon', 'GA'),
('Gambia', 'GM'),
('Georgia', 'GE'),
('Germany', 'DE'),
('Ghana', 'GH'),
('Gibraltar', 'GI'),
('Greece', 'GR'),
('Greenland', 'GL'),
('Grenada', 'GD'),
('Guadeloupe', 'GP'),
('Guam', 'GU'),
('Guatemala', 'GT'),
('Guernsey', 'GG'),
('Guinea', 'GN'),
('Guinea-Bissau', 'GW'),
('Guyana', 'GY'),
('Haiti', 'HT'),
('Heard Island and Mcdonald Islands', 'HM'),
('Holy See (Vatican City State)', 'VA'),
('Honduras', 'HN'),
('Hong Kong', 'HK'),
('Hungary', 'HU'),
('Iceland', 'IS'),
('India', 'IN'),
('Indonesia', 'ID'),
('Iran, Islamic Republic Of', 'IR'),
('Iraq', 'IQ'),
('Ireland', 'IE'),
('Isle of Man', 'IM'),
('Israel', 'IL'),
('Italy', 'IT'),
('Jamaica', 'JM'),
('Japan', 'JP'),
('Jersey', 'JE'),
('Jordan', 'JO'),
('Kazakhstan', 'KZ'),
('Kenya', 'KE'),
('Kiribati', 'KI'),
('Korea, Republic of', 'KR'),
('Kuwait', 'KW'),
('Kyrgyzstan', 'KG'),
('Laos', 'LA'),
('Latvia', 'LV'),
('Lebanon', 'LB'),
('Lesotho', 'LS'),
('Liberia', 'LR'),
('Libyan Arab Jamahiriya', 'LY'),
('Liechtenstein', 'LI'),
('Lithuania', 'LT'),
('Luxembourg', 'LU'),
('Macao', 'MO'),
('Madagascar', 'MG'),
('Malawi', 'MW'),
('Malaysia', 'MY'),
('Maldives', 'MV'),
('Mali', 'ML'),
('Malta', 'MT'),
('Marshall Islands', 'MH'),
('Martinique', 'MQ'),
('Mauritania', 'MR'),
('Mauritius', 'MU'),
('Mayotte', 'YT'),
('Mexico', 'MX'),
('Micronesia, Federated States of', 'FM'),
('Moldova, Republic of', 'MD'),
('Monaco', 'MC'),
('Mongolia', 'MN'),
('Montenegro', 'ME'),
('Montserrat', 'MS'),
('Morocco', 'MA'),
('Mozambique', 'MZ'),
('Myanmar', 'MM'),
('Namibia', 'NA'),
('Nauru', 'NR'),
('Nepal', 'NP'),
('Netherlands', 'NL'),
('Netherlands Antilles', 'AN'),
('New Caledonia', 'NC'),
('New Zealand', 'NZ'),
('Nicaragua', 'NI'),
('Niger', 'NE'),
('Nigeria', 'NG'),
('Niue', 'NU'),
('Norfolk Island', 'NF'),
('North Korea', 'KP'),
('North Macedonia', 'MK'),
('Northern Mariana Islands', 'MP'),
('Norway', 'NO'),
('Oman', 'OM'),
('Pakistan', 'PK'),
('Palau', 'PW'),
('Palestinian Territory, Occupied', 'PS'),
('Panama', 'PA'),
('Papua New Guinea', 'PG'),
('Paraguay', 'PY'),
('Peru', 'PE'),
('Philippines', 'PH'),
('Pitcairn Islands', 'PN'),
('Poland', 'PL'),
('Portugal', 'PT'),
('Puerto Rico', 'PR'),
('Qatar', 'QA'),
('Reunion', 'RE'),
('Romania', 'RO'),
('Russian Federation', 'RU'),
('Rwanda', 'RW'),
('Saint Barthélemy', 'BL'),
('Saint Helena', 'SH'),
('Saint Kitts and Nevis', 'KN'),
('Saint Lucia', 'LC'),
('Saint Martin', 'MF');

-- Database indexes
CREATE INDEX
	idx_product_name
ON
  products (name);

CREATE INDEX
  idx_products_sku
ON
  products (sku);

-- Database triggers
-- CREATE PRODUCT RATING TRIGGER!!
DELIMITER $$

CREATE TRIGGER calc_product_rating
AFTER INSERT ON reviews
FOR EACH ROW
BEGIN
   UPDATE products
   SET average_rating = (
       SELECT ROUND(SUM(r.rating) / COUNT(*), 2)
       FROM reviews r
       WHERE r.product_id = NEW.product_id
   )
   WHERE id = NEW.product_id;
END$$

DELIMITER ;

--CREATE USER RATING PRODUCT TRIGGER!!
DELIMITER ;
CREATE TRIGGER calc_user_rating
AFTER INSERT ON reviews
FOR EACH ROW
BEGIN
   UPDATE 
       profiles AS pf
    SET
        pf.average_rating = (
            SELECT 
                ROUND(SUM(r.rating) / COUNT(*), 2) 
            FROM
                reviews AS r
            INNER JOIN
                products AS pr
            ON
                pr.id = r.product_id
           INNER JOIN
                users AS u
            ON
                u.id = pr.user_id
            WHERE
                pr.user_id = (
                   SELECT
                       u.id
                   FROM
                       products AS p
                    INNER JOIN
                        users AS u
                    ON
                        u.id = p.user_id
                    WHERE
                        p.id = NEW.product_id
                )				
        )
    WHERE
        pf.user_id = (
            SELECT 
                pr.user_id
            FROM
                products AS pr
            WHERE
                pr.id = NEW.product_id
        );
END;

-- EMAIL_TEMPLATES
CREATE TABLE email_templates (
	type ENUM(
			'ORDER_RECEIPT',
			'ORDER_STATUS_CANCELLED',
			'ORDER_STATUS_DELIVERED',
			'ORDER_STATUS_FAILED_PAYMENT',
			'ORDER_STATUS_ON_DELIVERY',
			'ORDER_STATUS_PAID',
			'ORDER_STATUS_PENDING_PAYMENT',
			'ORDER_STATUS_SENT',
			'PASSWORD_RECOVERY') UNIQUE NOT NULL,
	html TEXT NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- PASSWORD_RECOVERY
INSERT INTO
	email_templates (type, html)
VALUES
	(
	'ORDER_RECEIPT',
	'<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Geologica:wght@100..900&display=swap"
      rel="stylesheet"
    />
    <title>Supersell</title>
    <style>
      @media screen and (max-width: 600px) {
        .content {
          width: 100% !important;
          display: block !important;
          padding: 10px !important;
        }

        .header,
        .body,
        .footer {
          font-family: 'Geologica', Arial, sans-serif;
          padding: 20px !important;
        }
      }
    </style>
  </head>
  <body style="font-family: 'Geologica', Arial, sans-serif">
    <table width="100%" border="0" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center" style="padding: 20px">
          <table
            class="content"
            width="600"
            border="0"
            cellspacing="0"
            cellpadding="0"
            style="border-collapse: collapse; border: 1px solid #cccccc"
          >
            <!-- Header -->
            <tr>
              <td
                class="header"
                style="
                  background-color: #403dfe;
                  text-align: center;
                  color: white;
                  font-size: 24px;
                  font-weight: 400;
                  letter-spacing: 3px;
                  padding-top: 22px;
                "
              >
                <h3>Supersell</h3>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td
                class="body"
                style="
                  padding: 20px;
                  text-align: left;
                  font-size: 16px;
                  line-height: 1.6;
                "
              >
                Hello, <%= first_name %>! <br />
                Click the button below to start your password recovery request.
              </td>
            </tr>

            <tr style="margin-bottom: 15px">
              <td
                style="
                  padding: 0px 20px 0px 20px;
                  text-align: center;
                  margin-bottom: 15px;
                  padding-bottom: 55px;
                "
              >
                <table cellspacing="0" cellpadding="0" style="margin: auto">
                  <tr>
                    <td
                      align="center"
                      style="
                        background-color: #403dfe;
                        padding: 10px 20px;
                        border-radius: 5px;
                      "
                    >
                      <a
                        href="#"
                        style="
                          color: #ffffff;
                          text-decoration: none;
                          font-weight: bold;
                        "
                        >Redirect</a
                      >
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                class="footer"
                style="
                  background-color: #545454;
                  padding: 20px;
                  text-align: center;
                  color: white;
                  font-size: 14px;
                "
              >
                <p>Supersell &copy; 2025 | by Augusto Souza</p>
                <a
                  href="https://github.com/augustojs1"
                  style="color: white; font-size: 12px"
                  >https://github.com/augustojs1</a
                >
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>'
	);

-- ORDER_RECEIPT
INSERT INTO
	email_templates (type, html)
VALUES
	(
	'ORDER_RECEIPT',
	'<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Geologica:wght@100..900&display=swap"
      rel="stylesheet"
    />
    <title>Supersell</title>
    <style>
      @media screen and (max-width: 600px) {
        .content {
          width: 100% !important;
          display: block !important;
          padding: 10px !important;
        }

        .header,
        .body,
        .footer {
          font-family: "Geologica", Arial, sans-serif;
          padding: 20px !important;
        }
      }
    </style>
  </head>
  <body style="font-family: 'Geologica', Arial, sans-serif">
    <table width="100%" border="0" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center" style="padding: 20px">
          <table
            class="content"
            width="600"
            border="0"
            cellspacing="0"
            cellpadding="0"
            style="border-collapse: collapse; border: 1px solid #cccccc"
          >
            <!-- Header -->
            <tr>
              <td
                class="header"
                style="
                  background-color: #403dfe;
                  text-align: center;
                  color: white;
                  font-size: 24px;
                  font-weight: 400;
                  letter-spacing: 3px;
                  padding-top: 22px;
                "
              >
                <h3>Supersell</h3>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td
                class="body"
                style="
                  padding: 20px;
                  text-align: left;
                  font-size: 16px;
                  line-height: 1.6;
                "
              >
                <p>Hello, <%= user.first_name %>! 👋</p>
                <p>
                  Thank you for your purchase! Here’s a summary of your order:
                </p>
                <br />
                <h2>🛒 Order Details</h2>
                <p><strong>Order Number:</strong> #<%= order_id %></p>
                <p><strong>Order Date:</strong> <%= order_created_at %></p>
                <hr />
              </td>
            </tr>

            <tr>
              <td
                class="body"
                style="
                  text-align: left;
                  font-size: 16px;
                  line-height: 1.6;
                  padding: 0px 20px;
                "
              >
                <h2>📦 Items Ordered:</h2>
                <ul>
                  <% order_items.forEach(item => { %>
                  <li>
                    <strong><%= item.product_name %></strong> (x<%=
                    item.quantity %>) – $ <%= item.subtotal_price %> <br />🛍
                    **Store:** <%= item.product_seller_username %>
                  </li>
                  <% }) %>
                </ul>
                <p><strong>💰 Total:</strong> $ <%= order_total_price %></p>
                <hr />
              </td>
            </tr>

            <tr>
              <td
                class="body"
                style="
                  text-align: left;
                  font-size: 16px;
                  line-height: 1.6;
                  padding: 0px 20px;
                "
              >
                <h2>🚚 Shipping Information</h2>
                <p><strong>Recipient:</strong> <%= user.first_name %></p>
                <p><strong>Delivery Address:</strong></p>
                <p>
                  <%= delivery_address.street %>, <%= delivery_address.number
                  %><br />
                  <%= delivery_address.city %>, <%= delivery_address.district %>
                  - <%= delivery_address.postalcode %><br />
                  <%= delivery_address.country_code %>
                </p>

                <p>
                  You’ll receive an update once your payment is confirmed and
                  your order is shipped.
                </p>
              </td>
            </tr>

            <tr>
              <td
                style="
                  padding: 20px;
                  text-align: left;
                  font-size: 16px;
                  line-height: 1.6;
                "
              >
                Best regards,
                <br />
                <b>Supersell Team</b>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                class="footer"
                style="
                  background-color: #545454;
                  padding: 20px;
                  text-align: center;
                  color: white;
                  font-size: 14px;
                "
              >
                <p>Supersell &copy; 2025 | by Augusto Souza</p>
                <a
                  href="https://github.com/augustojs1"
                  style="color: white; font-size: 12px"
                  >https://github.com/augustojs1</a
                >
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>'
	);
	
-- ORDER_STATUS_CANCELLED
INSERT INTO
	email_templates (type, html)
VALUES
	(
	'ORDER_STATUS_CANCELLED',
	'<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Geologica:wght@100..900&display=swap"
      rel="stylesheet"
    />
    <title>Supersell</title>
    <style>
      @media screen and (max-width: 600px) {
        .content {
          width: 100% !important;
          display: block !important;
          padding: 10px !important;
        }

        .header,
        .body,
        .footer {
          font-family: ''Geologica'', Arial, sans-serif;
          padding: 20px !important;
        }
      }
    </style>
  </head>
  <body style="font-family: ''Geologica'', Arial, sans-serif">
    <table width="100%" border="0" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center" style="padding: 20px">
          <table
            class="content"
            width="600"
            border="0"
            cellspacing="0"
            cellpadding="0"
            style="border-collapse: collapse; border: 1px solid #cccccc"
          >
            <!-- Header -->
            <tr>
              <td
                class="header"
                style="
                  background-color: #403dfe;
                  text-align: center;
                  color: white;
                  font-size: 24px;
                  font-weight: 400;
                  letter-spacing: 3px;
                  padding-top: 22px;
                "
              >
                <h3>Supersell</h3>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td
                class="body"
                style="
                  padding: 20px;
                  text-align: left;
                  font-size: 16px;
                  line-height: 1.6;
                "
              >
                Hello, <%= customer_name %>! <br />
                <br />
                Your order #<%= order_id %> has been cancelled.
                <br />
                If this was not intentional or if you need assistance, please
                contact our support team. If a payment was made, you will
                receive a refund according to our policy.
              </td>
            </tr>

            <tr>
              <td
                style="
                  padding: 0px 20px 0px 20px;
                  text-align: center;
                  padding-bottom: 25px;
                "
              >
                <table cellspacing="0" cellpadding="0" style="margin: auto">
                  <tr>
                    <td
                      align="center"
                      style="
                        background-color: #403dfe;
                        padding: 10px 20px;
                        border-radius: 5px;
                      "
                    >
                      <a
                        href="#"
                        style="
                          color: #ffffff;
                          text-decoration: none;
                          font-weight: bold;
                        "
                        >Contact Support</a
                      >
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td
                style="
                  padding: 20px;
                  text-align: left;
                  font-size: 16px;
                  line-height: 1.6;
                "
              >
                We’re here to help!
                <br />
                <br />
                Best regards,
                <br />
                <b>Supersell Team</b>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                class="footer"
                style="
                  background-color: #545454;
                  padding: 20px;
                  text-align: center;
                  color: white;
                  font-size: 14px;
                "
              >
                <p>Supersell &copy; 2025 | by Augusto Souza</p>
                <a
                  href="https://github.com/augustojs1"
                  style="color: white; font-size: 12px"
                  >https://github.com/augustojs1</a
                >
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>'
	);
	
-- ORDER_STATUS_DELIVERED
INSERT INTO
	email_templates (type, html)
VALUES
	(
	'ORDER_STATUS_DELIVERED',
	'<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Geologica:wght@100..900&display=swap"
      rel="stylesheet"
    />
    <title>Supersell</title>
    <style>
      @media screen and (max-width: 600px) {
        .content {
          width: 100% !important;
          display: block !important;
          padding: 10px !important;
        }

        .header,
        .body,
        .footer {
          font-family: ''Geologica'', Arial, sans-serif;
          padding: 20px !important;
        }
      }
    </style>
  </head>
  <body style="font-family: ''Geologica'', Arial, sans-serif">
    <table width="100%" border="0" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center" style="padding: 20px">
          <table
            class="content"
            width="600"
            border="0"
            cellspacing="0"
            cellpadding="0"
            style="border-collapse: collapse; border: 1px solid #cccccc"
          >
            <!-- Header -->
            <tr>
              <td
                class="header"
                style="
                  background-color: #403dfe;
                  text-align: center;
                  color: white;
                  font-size: 24px;
                  font-weight: 400;
                  letter-spacing: 3px;
                  padding-top: 22px;
                "
              >
                <h3>Supersell</h3>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td
                class="body"
                style="
                  padding: 20px;
                  text-align: left;
                  font-size: 16px;
                  line-height: 1.6;
                "
              >
                Hello, <%= customer_name %>! <br />
                <br />
                Your order #<%= order_id %> has been successfully delivered!
                <br />
                <br />
                🎉 We hope you love your purchase. If you have any issues,
                please reach out to our support team.
              </td>
            </tr>

            <tr>
              <td
                style="
                  padding: 0px 20px 0px 20px;
                  text-align: center;
                  padding-bottom: 25px;
                "
              >
                <table cellspacing="0" cellpadding="0" style="margin: auto">
                  <tr>
                    <td
                      align="center"
                      style="
                        background-color: #403dfe;
                        padding: 10px 20px;
                        border-radius: 5px;
                      "
                    >
                      <a
                        href="#"
                        style="
                          color: #ffffff;
                          text-decoration: none;
                          font-weight: bold;
                        "
                        >Leave a Review</a
                      >
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td
                style="
                  padding: 20px;
                  text-align: left;
                  font-size: 16px;
                  line-height: 1.6;
                "
              >
                Thank you for choosing Supersell!
                <br />
                <br />
                Best regards,
                <br />
                <b>Supersell Team</b>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                class="footer"
                style="
                  background-color: #545454;
                  padding: 20px;
                  text-align: center;
                  color: white;
                  font-size: 14px;
                "
              >
                <p>Supersell &copy; 2025 | by Augusto Souza</p>
                <a
                  href="https://github.com/augustojs1"
                  style="color: white; font-size: 12px"
                  >https://github.com/augustojs1</a
                >
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>'
	);
	
-- ORDER_STATUS_FAILED_PAYMENT
INSERT INTO
	email_templates (type, html)
VALUES
	(
	'ORDER_STATUS_FAILED_PAYMENT',
	'<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Geologica:wght@100..900&display=swap"
      rel="stylesheet"
    />
    <title>Supersell</title>
    <style>
      @media screen and (max-width: 600px) {
        .content {
          width: 100% !important;
          display: block !important;
          padding: 10px !important;
        }

        .header,
        .body,
        .footer {
          font-family: ''Geologica'', Arial, sans-serif;
          padding: 20px !important;
        }
      }
    </style>
  </head>
  <body style="font-family: ''Geologica'', Arial, sans-serif">
    <table width="100%" border="0" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center" style="padding: 20px">
          <table
            class="content"
            width="600"
            border="0"
            cellspacing="0"
            cellpadding="0"
            style="border-collapse: collapse; border: 1px solid #cccccc"
          >
            <!-- Header -->
            <tr>
              <td
                class="header"
                style="
                  background-color: #403dfe;
                  text-align: center;
                  color: white;
                  font-size: 24px;
                  font-weight: 400;
                  letter-spacing: 3px;
                  padding-top: 22px;
                "
              >
                <h3>Supersell</h3>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td
                class="body"
                style="
                  padding: 20px;
                  text-align: left;
                  font-size: 16px;
                  line-height: 1.6;
                "
              >
                Hello, <%= customer_name %>! <br />
                <br />
                Unfortunately, the payment for your order #<%= order_id %> was
                unsuccessful. This could be due to an issue with your payment
                method or insufficient funds.
              </td>
            </tr>

            <tr>
              <td
                style="
                  padding: 0px 20px 0px 20px;
                  text-align: center;
                  padding-bottom: 25px;
                "
              >
                <table cellspacing="0" cellpadding="0" style="margin: auto">
                  <tr>
                    <td
                      align="center"
                      style="
                        background-color: #403dfe;
                        padding: 10px 20px;
                        border-radius: 5px;
                      "
                    >
                      <a
                        href="#"
                        style="
                          color: #ffffff;
                          text-decoration: none;
                          font-weight: bold;
                        "
                        >Try Again</a
                      >
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td
                style="
                  padding: 20px;
                  text-align: left;
                  font-size: 16px;
                  line-height: 1.6;
                "
              >
                If you need help resolving this issue, feel free to contact our
                support team.
                <br />
                <br />
                Best regards,
                <br />
                <b>Supersell Team</b>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                class="footer"
                style="
                  background-color: #545454;
                  padding: 20px;
                  text-align: center;
                  color: white;
                  font-size: 14px;
                "
              >
                <p>Supersell &copy; 2025 | by Augusto Souza</p>
                <a
                  href="https://github.com/augustojs1"
                  style="color: white; font-size: 12px"
                  >https://github.com/augustojs1</a
                >
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>'
	);
	
-- ORDER_STATUS_ON_DELIVERY
INSERT INTO
	email_templates (type, html)
VALUES
	(
	'ORDER_STATUS_ON_DELIVERY',
	'<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Geologica:wght@100..900&display=swap"
      rel="stylesheet"
    />
    <title>Supersell</title>
    <style>
      @media screen and (max-width: 600px) {
        .content {
          width: 100% !important;
          display: block !important;
          padding: 10px !important;
        }

        .header,
        .body,
        .footer {
          font-family: ''Geologica'', Arial, sans-serif;
          padding: 20px !important;
        }
      }
    </style>
  </head>
  <body style="font-family: ''Geologica'', Arial, sans-serif">
    <table width="100%" border="0" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center" style="padding: 20px">
          <table
            class="content"
            width="600"
            border="0"
            cellspacing="0"
            cellpadding="0"
            style="border-collapse: collapse; border: 1px solid #cccccc"
          >
            <!-- Header -->
            <tr>
              <td
                class="header"
                style="
                  background-color: #403dfe;
                  text-align: center;
                  color: white;
                  font-size: 24px;
                  font-weight: 400;
                  letter-spacing: 3px;
                  padding-top: 22px;
                "
              >
                <h3>Supersell</h3>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td
                class="body"
                style="
                  padding: 20px;
                  text-align: left;
                  font-size: 16px;
                  line-height: 1.6;
                "
              >
                Hello, <%= customer_name %>! <br />
                <br />
                Your order #<%= order_id %> is almost there! Our delivery
                partner is currently bringing it to you.
              </td>
            </tr>

            <tr>
              <td
                style="
                  padding: 0px 20px 0px 20px;
                  text-align: center;
                  padding-bottom: 25px;
                "
              >
                <table cellspacing="0" cellpadding="0" style="margin: auto">
                  <tr>
                    <td
                      align="center"
                      style="
                        background-color: #403dfe;
                        padding: 10px 20px;
                        border-radius: 5px;
                      "
                    >
                      <a
                        href="#"
                        style="
                          color: #ffffff;
                          text-decoration: none;
                          font-weight: bold;
                        "
                        >Track Your Delivery</a
                      >
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td
                style="
                  padding: 20px;
                  text-align: left;
                  font-size: 16px;
                  line-height: 1.6;
                "
              >
                Make sure someone is available to receive the package. Enjoy
                your purchase!
                <br />
                <br />
                Best regards,
                <br />
                <b>Supersell Team</b>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                class="footer"
                style="
                  background-color: #545454;
                  padding: 20px;
                  text-align: center;
                  color: white;
                  font-size: 14px;
                "
              >
                <p>Supersell &copy; 2025 | by Augusto Souza</p>
                <a
                  href="https://github.com/augustojs1"
                  style="color: white; font-size: 12px"
                  >https://github.com/augustojs1</a
                >
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>'
	);
	
-- ORDER_STATUS_PAID
INSERT INTO
	email_templates (type, html)
VALUES
	(
	'ORDER_STATUS_PAID',
	'<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Geologica:wght@100..900&display=swap"
      rel="stylesheet"
    />
    <title>Supersell</title>
    <style>
      @media screen and (max-width: 600px) {
        .content {
          width: 100% !important;
          display: block !important;
          padding: 10px !important;
        }

        .header,
        .body,
        .footer {
          font-family: ''Geologica'', Arial, sans-serif;
          padding: 20px !important;
        }
      }
    </style>
  </head>
  <body style="font-family: ''Geologica'', Arial, sans-serif">
    <table width="100%" border="0" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center" style="padding: 20px">
          <table
            class="content"
            width="600"
            border="0"
            cellspacing="0"
            cellpadding="0"
            style="border-collapse: collapse; border: 1px solid #cccccc"
          >
            <!-- Header -->
            <tr>
              <td
                class="header"
                style="
                  background-color: #403dfe;
                  text-align: center;
                  color: white;
                  font-size: 24px;
                  font-weight: 400;
                  letter-spacing: 3px;
                  padding-top: 22px;
                "
              >
                <h3>Supersell</h3>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td
                class="body"
                style="
                  padding: 20px;
                  text-align: left;
                  font-size: 16px;
                  line-height: 1.6;
                "
              >
                Hello, <%= customer_name %>! <br />
                <br />
                Great news! We have received your payment for order #<%=
                order_id %>, and it is now being prepared for shipment.
                <br />
                <br />
                You’ll receive another update once your order has been shipped.
              </td>
            </tr>

            <tr>
              <td
                style="
                  padding: 0px 20px 0px 20px;
                  text-align: center;
                  padding-bottom: 25px;
                "
              >
                <table cellspacing="0" cellpadding="0" style="margin: auto">
                  <tr>
                    <td
                      align="center"
                      style="
                        background-color: #403dfe;
                        padding: 10px 20px;
                        border-radius: 5px;
                      "
                    >
                      <a
                        href="#"
                        style="
                          color: #ffffff;
                          text-decoration: none;
                          font-weight: bold;
                        "
                        >Track Your Order</a
                      >
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td
                style="
                  padding: 20px;
                  text-align: left;
                  font-size: 16px;
                  line-height: 1.6;
                "
              >
                Thank you for shopping with us!
                <br />
                <br />
                Best regards,
                <br />
                <b>Supersell Team</b>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                class="footer"
                style="
                  background-color: #545454;
                  padding: 20px;
                  text-align: center;
                  color: white;
                  font-size: 14px;
                "
              >
                <p>Supersell &copy; 2025 | by Augusto Souza</p>
                <a
                  href="https://github.com/augustojs1"
                  style="color: white; font-size: 12px"
                  >https://github.com/augustojs1</a
                >
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>'
	);
	
-- ORDER_STATUS_PENDING_PAYMENT
INSERT INTO
	email_templates (type, html)
VALUES
	(
	'ORDER_STATUS_PENDING_PAYMENT',
	'<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Geologica:wght@100..900&display=swap"
      rel="stylesheet"
    />
    <title>Supersell</title>
    <style>
      @media screen and (max-width: 600px) {
        .content {
          width: 100% !important;
          display: block !important;
          padding: 10px !important;
        }

        .header,
        .body,
        .footer {
          font-family: ''Geologica'', Arial, sans-serif;
          padding: 20px !important;
        }
      }
    </style>
  </head>
  <body style="font-family: ''Geologica'', Arial, sans-serif">
    <table width="100%" border="0" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center" style="padding: 20px">
          <table
            class="content"
            width="600"
            border="0"
            cellspacing="0"
            cellpadding="0"
            style="border-collapse: collapse; border: 1px solid #cccccc"
          >
            <!-- Header -->
            <tr>
              <td
                class="header"
                style="
                  background-color: #403dfe;
                  text-align: center;
                  color: white;
                  font-size: 24px;
                  font-weight: 400;
                  letter-spacing: 3px;
                  padding-top: 22px;
                "
              >
                <h3>Supersell</h3>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td
                class="body"
                style="
                  padding: 20px;
                  text-align: left;
                  font-size: 16px;
                  line-height: 1.6;
                "
              >
                Hello, <%= customer_name %>! <br />
                <br />
                We noticed that your order #<%= order_id %> is awaiting payment.
                To proceed with your purchase, please complete the payment as
                soon as possible.
              </td>
            </tr>

            <tr>
              <td
                style="
                  padding: 0px 20px 0px 20px;
                  text-align: center;
                  padding-bottom: 25px;
                "
              >
                <table cellspacing="0" cellpadding="0" style="margin: auto">
                  <tr>
                    <td
                      align="center"
                      style="
                        background-color: #403dfe;
                        padding: 10px 20px;
                        border-radius: 5px;
                      "
                    >
                      <a
                        href="#"
                        style="
                          color: #ffffff;
                          text-decoration: none;
                          font-weight: bold;
                        "
                        >Complete Payment Now</a
                      >
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td
                style="
                  padding: 20px;
                  text-align: left;
                  font-size: 16px;
                  line-height: 1.6;
                "
              >
                If you have already made the payment, please ignore this
                message. Let us know if you need any assistance!
                <br />
                <br />
                Best regards,
                <br />
                <b>Supersell Team</b>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                class="footer"
                style="
                  background-color: #545454;
                  padding: 20px;
                  text-align: center;
                  color: white;
                  font-size: 14px;
                "
              >
                <p>Supersell &copy; 2025 | by Augusto Souza</p>
                <a
                  href="https://github.com/augustojs1"
                  style="color: white; font-size: 12px"
                  >https://github.com/augustojs1</a
                >
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>'
	);
	
-- ORDER_STATUS_SENT
INSERT INTO
	email_templates (type, html)
VALUES
	(
	'ORDER_STATUS_SENT',
	'<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Geologica:wght@100..900&display=swap"
      rel="stylesheet"
    />
    <title>Supersell</title>
    <style>
      @media screen and (max-width: 600px) {
        .content {
          width: 100% !important;
          display: block !important;
          padding: 10px !important;
        }

        .header,
        .body,
        .footer {
          font-family: ''Geologica'', Arial, sans-serif;
          padding: 20px !important;
        }
      }
    </style>
  </head>
  <body style="font-family: ''Geologica'', Arial, sans-serif">
    <table width="100%" border="0" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center" style="padding: 20px">
          <table
            class="content"
            width="600"
            border="0"
            cellspacing="0"
            cellpadding="0"
            style="border-collapse: collapse; border: 1px solid #cccccc"
          >
            <!-- Header -->
            <tr>
              <td
                class="header"
                style="
                  background-color: #403dfe;
                  text-align: center;
                  color: white;
                  font-size: 24px;
                  font-weight: 400;
                  letter-spacing: 3px;
                  padding-top: 22px;
                "
              >
                <h3>Supersell</h3>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td
                class="body"
                style="
                  padding: 20px;
                  text-align: left;
                  font-size: 16px;
                  line-height: 1.6;
                "
              >
                Hello, <%= customer_name %>! <br />
                <br />
                Great news! We have received your payment for order #<%=
                order_id %>, and it is now being prepared for shipment.
                <br />
                <br />
                You’ll receive another update once your order has been shipped.
              </td>
            </tr>

            <tr>
              <td
                style="
                  padding: 0px 20px 0px 20px;
                  text-align: center;
                  padding-bottom: 25px;
                "
              >
                <table cellspacing="0" cellpadding="0" style="margin: auto">
                  <tr>
                    <td
                      align="center"
                      style="
                        background-color: #403dfe;
                        padding: 10px 20px;
                        border-radius: 5px;
                      "
                    >
                      <a
                        href="#"
                        style="
                          color: #ffffff;
                          text-decoration: none;
                          font-weight: bold;
                        "
                        >Track Your Order</a
                      >
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td
                style="
                  padding: 20px;
                  text-align: left;
                  font-size: 16px;
                  line-height: 1.6;
                "
              >
                Thank you for shopping with us!
                <br />
                <br />
                Best regards,
                <br />
                <b>Supersell Team</b>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                class="footer"
                style="
                  background-color: #545454;
                  padding: 20px;
                  text-align: center;
                  color: white;
                  font-size: 14px;
                "
              >
                <p>Supersell &copy; 2025 | by Augusto Souza</p>
                <a
                  href="https://github.com/augustojs1"
                  style="color: white; font-size: 12px"
                  >https://github.com/augustojs1</a
                >
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>'
	);