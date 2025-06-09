#!/bin/bash

# Очистка npm кэша
npm cache clean --force

# Установка зависимостей
npm ci --production=false

# Сборка проекта
npm run build 