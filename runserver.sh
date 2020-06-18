#!/bin/bash

if [ ! -d "./data" ]; then
    ./install.sh
fi

yarn && \
npm run dev && \
python3 manage.py runserver 0.0.0.0:8000
