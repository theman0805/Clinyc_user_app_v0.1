@echo off
echo Starting Clinyc mobile app...
echo.
echo Make sure you have Expo Go installed on your mobile device
echo.
set NPM_CONFIG_LEGACY_PEER_DEPS=true
npx --no-install expo start --offline --no-dev --minify 