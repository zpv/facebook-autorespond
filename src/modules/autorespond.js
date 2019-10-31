import { sendMessage } from '../lib/chatbot';

export default class Autorespond {
  constructor(api) {
    this.api = api;
    this.sessions = {};
  }

  getSession(threadID) {
    this.sessions[threadID] = this.sessions[threadID] || {};
    return this.sessions[threadID];
  }

  toggleAutorespond(threadID) {
    const session = this.getSession(threadID);
    session.autorespond = !session.autorespond;

    this.api.sendMessage(
      `*[SteveBot]* Autorespond toggled ${session.autorespond ? 'on' : 'off'}`,
      threadID
    );
  }

  isSelf(senderID) {
    return senderID === this.api.getCurrentUserID();
  }

  async handleMessage(message) {
    const session = this.getSession(message.threadID);
    const { threadID, senderID } = message;

    if (message.body === '/autorespond') {
      this.toggleAutorespond(threadID);
    }

    if (!session.autorespond || this.isSelf(senderID)) {
      return;
    }

    await this.reply(session, message);
  }

  async reply(session, message) {
    const { sessionId, clientName } = session;
    const response = await sendMessage(message.body, sessionId, clientName);

    Object.assign(session, {
      sessionId: response.sessionId,
      clientName: response.clientName
    });

    this.api.sendMessage(response.message, message.threadID);
  }
}
