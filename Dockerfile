# Use the official PHP image with Apache
FROM php:8.2-apache

# Enable Apache mod_rewrite (optional, but useful for many PHP apps)
RUN a2enmod rewrite

RUN apt-get update && apt-get install -y libpq-dev \
&& docker-php-ext-install pdo pdo_pgsql

# Copy all application files to the Apache document root
COPY . /var/www/html/

# Set recommended permissions (optional, adjust as needed)
RUN chown -R www-data:www-data /var/www/html

# Copy the entrypoint.sh script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Expose port 80
EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]