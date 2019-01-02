#!/bin/bash

if [ ! -d "./data" ]; then
    ./install.sh
fi

npm run dev && \
python manage.py runserver 0.0.0.0:8000