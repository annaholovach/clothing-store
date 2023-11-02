DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'cloth_store') THEN
        CREATE DATABASE cloth_store;
    END IF;
END $$;

-- clothing
CREATE TABLE IF NOT EXISTS clothing (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  size VARCHAR(255) NOT NULL,
  price INTEGER NOT NULL,
  description VARCHAR(255),
  image VARCHAR(255)
);

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('admin', 'user', 'moderator');
    END IF;
END $$;

-- users
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role user_role DEFAULT 'user'
);

-- orders
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  userId INTEGER REFERENCES users(id),
  items JSONB NOT NULL,
  totalPrice DECIMAL,
  createdAt TIMESTAMP DEFAULT current_timestamp
);

-- cloth_order
CREATE TABLE IF NOT EXISTS cloth_order (
  id SERIAL PRIMARY KEY,
  cloth_id INTEGER REFERENCES clothing(id) ON UPDATE CASCADE ON DELETE CASCADE,
  order_id INTEGER REFERENCES orders(id) ON UPDATE CASCADE,
  amount INTEGER
);

