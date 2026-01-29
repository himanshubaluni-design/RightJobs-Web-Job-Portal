// RightJobs - Supabase Configuration
// This file connects your website to the Supabase database

const SUPABASE_URL = 'https://rjjfjzgvthhqeokfrrwd.supabase.co';
const SUPABASE_KEY = 'sb_publishable_pVt20rvsYHWVEIg5EBVuUQ_-NkWkdmr';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ============================================
// JOB FUNCTIONS
// ============================================

// Fetch all jobs (with optional filters)
async function getJobs(filters = {}) {
    let query = supabase
        .from('Jobs')
        .select('*')
        .eq('is_active', true)
        .order('id', { ascending: false });

    // Apply filters if provided
    if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`);
    }
    if (filters.category) {
        query = query.eq('category', filters.category);
    }
    if (filters.job_type) {
        query = query.eq('job_type', filters.job_type);
    }
    if (filters.salary_min) {
        query = query.gte('salary_max', filters.salary_min);
    }
    if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,company_name.ilike.%${filters.search}%`);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching jobs:', error);
        return [];
    }
    return data;
}

// Fetch single job by ID
async function getJobById(id) {
    const { data, error } = await supabase
        .from('Jobs')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching job:', error);
        return null;
    }
    return data;
}

// Fetch jobs by category
async function getJobsByCategory(category) {
    return getJobs({ category: category });
}

// Fetch jobs by location
async function getJobsByLocation(location) {
    return getJobs({ location: location });
}

// Search jobs
async function searchJobs(searchTerm) {
    return getJobs({ search: searchTerm });
}

// Get unique categories from jobs
async function getCategories() {
    const { data, error } = await supabase
        .from('Jobs')
        .select('category')
        .eq('is_active', true);

    if (error) {
        console.error('Error fetching categories:', error);
        return [];
    }

    // Get unique categories
    const categories = [...new Set(data.map(job => job.category))];
    return categories.filter(cat => cat); // Remove null/empty
}

// Get unique locations from jobs
async function getLocations() {
    const { data, error } = await supabase
        .from('Jobs')
        .select('location')
        .eq('is_active', true);

    if (error) {
        console.error('Error fetching locations:', error);
        return [];
    }

    // Get unique locations
    const locations = [...new Set(data.map(job => job.location))];
    return locations.filter(loc => loc); // Remove null/empty
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Format salary for display (e.g., 18000 -> "₹18,000")
function formatSalary(amount) {
    if (!amount) return 'Not disclosed';
    return '₹' + amount.toLocaleString('en-IN');
}

// Format salary range (e.g., "₹18,000 - ₹28,000/month")
function formatSalaryRange(min, max) {
    if (!min && !max) return 'Not disclosed';
    if (!max) return formatSalary(min) + '+/month';
    if (!min) return 'Up to ' + formatSalary(max) + '/month';
    return formatSalary(min) + ' - ' + formatSalary(max) + '/month';
}

// Format experience (e.g., "0-2 Yrs")
function formatExperience(min, max) {
    if (min === 0 && max === 0) return 'Fresher';
    if (!max) return min + '+ Yrs';
    return min + '-' + max + ' Yrs';
}

// ============================================
// TEST CONNECTION
// ============================================

// Test if Supabase is connected (call this to verify setup)
async function testConnection() {
    try {
        const { data, error } = await supabase
            .from('Jobs')
            .select('id')
            .limit(1);

        if (error) {
            console.error('Supabase connection failed:', error);
            return false;
        }
        console.log('Supabase connected successfully!');
        return true;
    } catch (err) {
        console.error('Supabase connection error:', err);
        return false;
    }
}

// Log connection status on load
testConnection();
