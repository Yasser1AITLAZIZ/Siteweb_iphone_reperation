-- Supabase Database Schema for iRepair Pro
-- This file contains the complete database schema for the iRepair Pro application

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Create profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'technician', 'admin')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    address JSONB,
    permissions TEXT[] DEFAULT '{}',
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create phone_models table
CREATE TABLE IF NOT EXISTS phone_models (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    year INTEGER NOT NULL CHECK (year >= 2007 AND year <= 2024),
    is_supported BOOLEAN DEFAULT TRUE,
    image_url TEXT,
    base_price DECIMAL(10,2) NOT NULL CHECK (base_price >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create repair_services table
CREATE TABLE IF NOT EXISTS repair_services (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL CHECK (price > 0),
    estimated_time INTEGER NOT NULL CHECK (estimated_time > 0), -- in hours
    category TEXT NOT NULL CHECK (category IN ('screen', 'battery', 'camera', 'audio', 'connector', 'other')),
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    customer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    phone_model TEXT NOT NULL,
    serial_number TEXT,
    services JSONB NOT NULL, -- Array of repair services
    notes TEXT,
    customer_address JSONB,
    status TEXT DEFAULT 'recu' CHECK (status IN ('recu', 'diagnostic', 'en_attente', 'en_reparation', 'pret', 'livre', 'annule')),
    total_price DECIMAL(10,2) NOT NULL CHECK (total_price >= 0),
    estimated_completion TIMESTAMP WITH TIME ZONE,
    tracking_id TEXT UNIQUE NOT NULL DEFAULT uuid_generate_v4()::text,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Create quotes table
CREATE TABLE IF NOT EXISTS quotes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    customer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    phone_model TEXT NOT NULL,
    services JSONB NOT NULL,
    total_price DECIMAL(10,2) NOT NULL CHECK (total_price >= 0),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'expired')),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create knowledge_chunks table for RAG system
CREATE TABLE IF NOT EXISTS knowledge_chunks (
    id TEXT PRIMARY KEY,
    content TEXT NOT NULL,
    embedding VECTOR(768), -- Gemini embedding dimension
    metadata JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for vector similarity search
CREATE INDEX IF NOT EXISTS knowledge_chunks_embedding_idx ON knowledge_chunks 
USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Create index for metadata queries
CREATE INDEX IF NOT EXISTS knowledge_chunks_metadata_idx ON knowledge_chunks USING GIN (metadata);

-- Create order_status_history table for tracking
CREATE TABLE IF NOT EXISTS order_status_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
    status TEXT NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES profiles(id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_quotes_customer_id ON quotes(customer_id);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_phone_models_updated_at BEFORE UPDATE ON phone_models
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_repair_services_updated_at BEFORE UPDATE ON repair_services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quotes_updated_at BEFORE UPDATE ON quotes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_knowledge_chunks_updated_at BEFORE UPDATE ON knowledge_chunks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;

-- Profiles policies (simplified to avoid recursion)
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Orders policies
CREATE POLICY "Users can view own orders" ON orders
    FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "Users can create own orders" ON orders
    FOR INSERT WITH CHECK (auth.uid() = customer_id);

-- Quotes policies
CREATE POLICY "Users can view own quotes" ON quotes
    FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "Users can create own quotes" ON quotes
    FOR INSERT WITH CHECK (auth.uid() = customer_id);

-- Order status history policies
CREATE POLICY "Users can view own order history" ON order_status_history
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE id = order_id AND customer_id = auth.uid()
        )
    );

-- Public tables (no RLS needed)
-- phone_models, repair_services, knowledge_chunks are public

-- Insert sample data (with proper escaping)
INSERT INTO phone_models (brand, model, year, base_price, is_supported) VALUES
('Apple', 'iPhone 15 Pro Max', 2023, 0, true),
('Apple', 'iPhone 15 Pro', 2023, 0, true),
('Apple', 'iPhone 15', 2023, 0, true),
('Apple', 'iPhone 14 Pro Max', 2022, 0, true),
('Apple', 'iPhone 14 Pro', 2022, 0, true),
('Apple', 'iPhone 14', 2022, 0, true),
('Apple', 'iPhone 13 Pro Max', 2021, 0, true),
('Apple', 'iPhone 13 Pro', 2021, 0, true),
('Apple', 'iPhone 13', 2021, 0, true),
('Apple', 'iPhone 12 Pro Max', 2020, 0, true),
('Apple', 'iPhone 12 Pro', 2020, 0, true),
('Apple', 'iPhone 12', 2020, 0, true);

INSERT INTO repair_services (name, description, price, estimated_time, category) VALUES
('Ecran casse - Reparation', 'Remplacement de l''ecran endommage', 299.99, 2, 'screen'),
('Batterie defaillante', 'Remplacement de la batterie', 89.99, 1, 'battery'),
('Camera arriere', 'Remplacement de la camera arriere', 199.99, 2, 'camera'),
('Camera avant', 'Remplacement de la camera avant', 149.99, 1, 'camera'),
('Haut-parleur', 'Remplacement du haut-parleur', 79.99, 1, 'audio'),
('Microphone', 'Remplacement du microphone', 69.99, 1, 'audio'),
('Port de charge', 'Remplacement du port de charge', 99.99, 1, 'connector'),
('Bouton d''alimentation', 'Remplacement du bouton d''alimentation', 59.99, 1, 'other'),
('Bouton volume', 'Remplacement des boutons de volume', 49.99, 1, 'other'),
('Diagnostic complet', 'Diagnostic complet de l''appareil', 29.99, 1, 'other');

-- Create a function to generate tracking IDs
CREATE OR REPLACE FUNCTION generate_tracking_id()
RETURNS TEXT AS $$
BEGIN
    RETURN 'IRP-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 8));
END;
$$ LANGUAGE plpgsql;

-- Update orders table to use the function
ALTER TABLE orders ALTER COLUMN tracking_id SET DEFAULT generate_tracking_id();
