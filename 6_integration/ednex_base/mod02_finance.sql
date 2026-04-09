-- Mod-02: Finance (Accounts)
CREATE TABLE IF NOT EXISTS mod02_student_accounts (
    student_id UUID PRIMARY KEY REFERENCES mod00_users(id),
    current_balance NUMERIC(15, 2) DEFAULT 0.00,
    past_due NUMERIC(15, 2) DEFAULT 0.00,
    net_amount_due NUMERIC(15, 2) DEFAULT 0.00,
    last_payment_date TIMESTAMPTZ,
    last_payment_amount NUMERIC(15, 2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB
);

-- Mod-02: Finance (Transactions)
CREATE TABLE IF NOT EXISTS mod02_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES mod00_users(id),
    amount NUMERIC(15, 2) NOT NULL,
    transaction_type TEXT CHECK (transaction_type IN ('tuition', 'fee', 'payment', 'refund', 'aid_disbursement')),
    description TEXT,
    reference_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
