import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import RedisPubSub from '/imports/startup/server/redis';
import RegexWebUrl from '/imports/utils/regex-weburl';
import { extractCredentials } from '/imports/api/common/server/helpers';
import Logger from '/imports/startup/server/logger';
import axios from "axios";

const HTML_SAFE_MAP = {
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

const parseMessage = (message) => {
  let parsedMessage = message || '';
  parsedMessage = parsedMessage.trim();

  // Replace <br/> with \n\r
  parsedMessage = parsedMessage.replace(/<br\s*[\\/]?>/gi, '\n\r');

  // Sanitize. See: http://shebang.brandonmintern.com/foolproof-html-escaping-in-javascript/
  parsedMessage = parsedMessage.replace(/[<>'"]/g, (c) => HTML_SAFE_MAP[c]);

  // Replace flash links to flash valid ones
  parsedMessage = parsedMessage.replace(RegexWebUrl, "<a href='event:$&'><u>$&</u></a>");

  return parsedMessage;
};

export default function sendGroupChatMsg(chatId, message) {
  const REDIS_CONFIG = Meteor.settings.private.redis;
  const CHANNEL = REDIS_CONFIG.channels.toAkkaApps;
  const EVENT_NAME = 'SendGroupChatMessageMsg';

  try {
    const { meetingId, requesterUserId } = extractCredentials(this.userId);

    check(meetingId, String);
    check(requesterUserId, String);
    check(chatId, String);
    check(message, Object);

    const parsedMessage = parseMessage(message.message);

    const myMSG=parsedMessage;

    message.message = parsedMessage;

    const payload = {
      msg: message,
      chatId,
    };

    axios.post('https://kchat.konn3ct.net/api/v1/chat.sendMessage', {
      "message": {
        "_id": "messageId044",
        "rid": "oHj4LaMLqMeQtkoqj",
        "msg": myMSG
      }
    })
        .then(function (response) {
          console.log(response);
          Logger.error(response);
        })
        .catch(function (error) {
          console.log(error);
          Logger.error(error);
        });

    RedisPubSub.publishUserMessage(CHANNEL, EVENT_NAME, meetingId, requesterUserId, payload);
  } catch (err) {
    Logger.error(`Exception while invoking method sendGroupChatMsg ${err.stack}`);
  }
}
