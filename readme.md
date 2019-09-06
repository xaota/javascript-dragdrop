# javascript-fetch-api

хелпер? для запросов к `json-api` с фронтенда

### Установка
```shell
$ npm install javascript-fetch-api
```

Надо настроить в вашем сервере резолв с `/javascript-fetch-api` в `node_modules/javascript-fetch-api`

### Особенность
Серверный `Api` должен иметь вид:
```HTTP
HTTP POST /endpoint?method&version
```
- параметр `version` не обязательный, по умолчанию равен `1.0.0`
- параметр `method` может содержать значение, а может быть им самим
- ответы должны быть в формате `JSON`

### Настройка
> **_Пример_**: для пакета [javascript-server](https://www.npmjs.com/package/javascript-server) и метода `/api/temp?friends.get`
```javascript
import Api from '/javascript-fetch-api/index.js';

const endpoint = new Api('/api/temp');
const data = await endpoint.json('friends.get', {...params});
```

### Возможности
- `{Promise} endpoint.json(method, data, version = '1.0.0')` отправка `js`-объекта
- `{Promise} endpoint.file(method, data, version = '1.0.0')` отпрака файлов
- `static async Api.json(url)` загрузка JSON GET запросом (удобно, если файл статичный)

### Дополнительно
Если вы используете vscode, можно настроить резолв для корректной работы самого редактора с помощью файла `jsconfig.json`
```json
{
  "compilerOptions": {
    "baseUrl": "../node_modules/",
    "paths": {
      "/javascript-fetch-api/*": ["./javascript-fetch-api/*"]
    }
  }
}
```
