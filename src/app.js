import 'dotenv/config';
import login from 'facebook-chat-api';
import authenticator from 'otplib/authenticator';
import crypto from 'crypto';
import fs from 'fs';

import * as Modules from './modules/';

authenticator.options = { crypto };

if (!fs.existsSync('appstate.json')) {
  login(
    {
      email: process.env.USERNAME,
      password: process.env.PASSWORD
    },
    (err, api) => {
      if (err) {
        switch (err.error) {
          case 'login-approval':
            const token = authenticator.generate(process.env.OTP_SECRET);
            console.log(token);
            err.continue(token);
            break;
          default:
            console.error(err);
        }
        return;
      }

      fs.writeFileSync('appstate.json', JSON.stringify(api.getAppState()));
    }
  );
} else {
  login(
    { appState: JSON.parse(fs.readFileSync('appstate.json', 'utf8')) },
    (err, api) => {
      console.log('Loading modules...');
      const _loadedModules = Object.keys(Modules).map(key => {
        console.log(`${key} module loaded.`);
        return new Modules[key](api);
      });

      api.setOptions({ selfListen: true });

      api.listen(async (err, message) => {
        if (err) return console.error(err);
        _loadedModules.forEach(module => module.handleMessage(message));
      });
    }
  );
}
