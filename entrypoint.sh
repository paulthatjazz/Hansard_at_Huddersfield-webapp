#!/bin/sh
set -e

if [ -z "$DB_USER" ] || [ -z "$DB_PASSWORD" ]; then
  echo "Error: DB_USER and DB_PASSWORD environment variables must be set."
  exit 1
fi

echo "user = $DB_USER" > /var/www/html/src/php/db/dbconfig.ini
echo "password = $DB_PASSWORD" >> /var/www/html/src/php/db/dbconfig.ini

# Check if values were written to dbconfig.ini
if ! grep -q "user =" /var/www/html/src/php/db/dbconfig.ini || ! grep -q "password =" /var/www/html/src/php/db/dbconfig.ini; then
  echo "Error: user or password not found in dbconfig.ini."
  exit 1
fi

exec apache2-foreground 