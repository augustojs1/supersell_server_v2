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

-- Database triggers
-- TRIGGERS !!
-- CREATE PRODUCT RATING TRIGGER!!
--DELIMITER $$
--
--CREATE TRIGGER calc_product_rating
--AFTER INSERT ON reviews
--FOR EACH ROW
--BEGIN
--    UPDATE products
--    SET average_rating = (
--        SELECT ROUND(SUM(r.rating) / COUNT(*), 2)
--        FROM reviews r
--        WHERE r.product_id = NEW.product_id
--    )
--    WHERE id = NEW.product_id;
--END$$

--CREATE USER RATING PRODUCT TRIGGER!!
--DELIMITER ;
--CREATE TRIGGER calc_user_rating
--AFTER INSERT ON reviews
--FOR EACH ROW
--BEGIN
--    UPDATE 
--        profiles AS pf
--     SET
--         pf.average_rating = (
--             SELECT 
--                 ROUND(SUM(r.rating) / COUNT(*), 2) 
--             FROM
--                 reviews AS r
--             INNER JOIN
--                 products AS pr
--             ON
--                 pr.id = r.product_id
--            INNER JOIN
--                 users AS u
--             ON
--                 u.id = pr.user_id
--             WHERE
--                 pr.user_id = (
--                    SELECT
--                        u.id
--                    FROM
--                        products AS p
--                     INNER JOIN
--                         users AS u
--                     ON
--                         u.id = p.user_id
--                     WHERE
--                         p.id = NEW.product_id
--                 )				
--         )
--     WHERE
--         pf.user_id = (
--             SELECT 
--                 pr.user_id
--             FROM
--                 products AS pr
--             WHERE
--                 pr.id = NEW.product_id
--         );
--END;
