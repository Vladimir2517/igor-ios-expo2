# Игорь — iPhone-приложение

Нативный Expo-проект для сборки через EAS/TestFlight.

Перед сборкой замени `API_URL` в `App.js` и `extra.apiUrl` в `app.json` на адрес опубликованного backend-сервера.

## Локальный запуск

```bash
npm install
npx expo start
```

## Сборка через EAS

```bash
npm install
npx eas login
npx eas build:configure
npx eas build --platform ios --profile production
npx eas submit --platform ios --profile production
```

EAS попросит войти в Apple Developer и создаст необходимые сертификаты/профили. Пароли и коды вводятся только в официальных окнах Expo/Apple.
