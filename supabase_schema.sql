-- Create Requests Table
CREATE TABLE IF NOT EXISTS public.requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    whatsapp TEXT,
    address TEXT NOT NULL,
    request_content TEXT NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, completed, cancelled
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    price NUMERIC NOT NULL,
    profit_margin NUMERIC,
    wholesale_price NUMERIC,
    image_url TEXT,
    product_url TEXT,
    description TEXT,
    available_quantity INTEGER DEFAULT 0,
    available_colors TEXT[], -- Array of strings e.g. ['red', 'blue']
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Optional: Enable Row Level Security (RLS)
-- ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
