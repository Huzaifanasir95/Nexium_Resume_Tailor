-- Create resume_analyses table
CREATE TABLE resume_analyses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    analysis_id TEXT UNIQUE NOT NULL,
    user_id TEXT NOT NULL,
    job_title TEXT,
    company TEXT,
    analysis_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    job_description TEXT,
    resume_text TEXT,
    results JSONB,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on analysis_id for faster queries
CREATE INDEX idx_resume_analyses_analysis_id ON resume_analyses(analysis_id);
CREATE INDEX idx_resume_analyses_user_id ON resume_analyses(user_id);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE resume_analyses ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations for now (you can restrict this later)
CREATE POLICY "Allow all operations on resume_analyses" ON resume_analyses
    FOR ALL USING (true);
