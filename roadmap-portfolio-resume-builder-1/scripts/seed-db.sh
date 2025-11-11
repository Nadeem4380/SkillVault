#!/bin/bash

# This script seeds the database with initial data.

# Database configuration
DB_NAME="your_database_name"
DB_USER="your_database_user"
DB_PASSWORD="your_database_password"
DB_HOST="localhost"

# Seed the database with initial data
echo "Seeding the database..."

mysql -u $DB_USER -p$DB_PASSWORD -h $DB_HOST $DB_NAME < ./backend/src/db/seeds/seed_initial_data.sql

if [ $? -eq 0 ]; then
    echo "Database seeded successfully."
else
    echo "Error seeding the database."
fi