#!/bin/sh

# This script waits for the database to be initialized
# It basically tries to connect, and only exits when it succeeds

while ! mysql -u$DB_USER -p$DB_PASSWORD -h$DB_HOST -P$DB_PORT -e ";" > /dev/null; do
    sleep 2
    echo "Waiting for db..."
done
