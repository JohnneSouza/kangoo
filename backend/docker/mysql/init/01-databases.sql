CREATE DATABASE IF NOT EXISTS auth_data;
CREATE DATABASE IF NOT EXISTS customers_data;

GRANT ALL PRIVILEGES ON customers_data.* TO 'db_user'@'%';
GRANT ALL PRIVILEGES ON auth_data.* TO 'db_user'@'%';