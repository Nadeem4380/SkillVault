#!/bin/bash

# This script sets up the database for the Roadmap, Portfolio, and Resume Builder application.

# Load environment variables from .env file
if [ -f ../backend/.env ]; then
    export $(grep -v '^#' ../backend/.env | xargs)
fi

# Database connection details
DB_HOST=${DB_HOST:-localhost}
DB_USER=${DB_USER:-root}
DB_PASS=${DB_PASS:-password}
DB_NAME=${DB_NAME:-roadmap_portfolio_resume}

# Create the database if it doesn't exist
mysql -h $DB_HOST -u $DB_USER -p$DB_PASS -e "CREATE DATABASE IF NOT EXISTS $DB_NAME;"

# Apply migrations
for migration in ../backend/src/db/migrations/*.sql; do
    mysql -h $DB_HOST -u $DB_USER -p$DB_PASS $DB_NAME < "$migration"
done

echo "Database setup completed successfully."