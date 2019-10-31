import superagent from 'superagent';
import { filterMessage } from './filter';

const HOME = 'https://www.pandorabots.com/mitsuku/',
  ENDPOINT = 'https://miapi.pandorabots.com/talk',
  USER_AGENT =
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36';

const getKey = async agent => {
  const res = await agent.get(HOME);
  return res.text.match(/PB_BOTKEY: "(.*)"/m)[1];
};

export const sendMessage = async (msg, session, clientName) => {
  if (!clientName) {
    clientName = 'cw'.concat(Date.now().toString(16));
  }

  const agent = superagent.agent();
  agent.set('User-Agent', USER_AGENT);

  const botkey = await getKey(agent);

  const data = {
    input: msg,
    session: session,
    channel: 6,
    botkey,
    client_name: clientName
  };

  let req;

  try {
    req = await agent
      .post(ENDPOINT)
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Referer', 'https://www.pandorabots.com/mitsuku/')
      .set('Sec-Fetch-Mode', 'cors')
      .send(data);
  } catch (e) {
    console.error(e);
  }

  const { responses, sessionid: sessionId } = req.body;

  return {
    message: filterMessage(responses[0]),
    sessionId,
    clientName
  };
};
