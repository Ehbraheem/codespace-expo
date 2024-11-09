#!/bin/bash
# scripts/post-create.sh

# Ensure correct permissions
sudo chown -R $USER:$USER /workspaces

# Install dependencies and run prebuild
npm install
npx expo install
sudo chmod -R 777 android
EXPO_NO_GIT_STATUS=1 npx expo prebuild --platform android --clean
