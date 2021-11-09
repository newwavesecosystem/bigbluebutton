import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';
import RedisPubSub from '/imports/startup/server/redis';
import RegexWebUrl from '/imports/utils/regex-weburl';
import {extractCredentials} from '/imports/api/common/server/helpers';
import Logger from '/imports/startup/server/logger';
import axios from 'axios';

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

export default function sendGroupChatMsg(chatId, message, custumPayload) {
  const REDIS_CONFIG = Meteor.settings.private.redis;
  const CHANNEL = REDIS_CONFIG.channels.toAkkaApps;
  const EVENT_NAME = 'SendGroupChatMessageMsg';

  try {
    const {meetingId, requesterUserId} = extractCredentials(this.userId);

    check(meetingId, String);
    check(requesterUserId, String);
    check(chatId, String);
    check(message, Object);

    const parsedMessage = parseMessage(message.message);

    message.message = parsedMessage;

    const payload = {
      msg: message,
      chatId,
    };

    RedisPubSub.publishUserMessage(CHANNEL, EVENT_NAME, meetingId, requesterUserId, payload);


    const rand = `fkmr${Math.floor(Math.random() * 100000000) + 5}`;
    const userEmail = custumPayload.uemail;
    const roomName = custumPayload.room;
    const room = roomName.replace(" ", "-")

    Logger.info('groupchat.roomName');
    Logger.info(userEmail);

    Logger.info('groupchat.roommy');
    Logger.info(room);

    Logger.info('groupchat.SenderEmail');
    Logger.info(userEmail);

    Logger.info('groupchat.message');
    Logger.info(parsedMessage);

    Logger.info('groupchat.messgeID');
    Logger.info(rand);

    axios.post('https://kchat.konn3ct.net/api/v1/konn3ct.sendMessage.group', {
      "email": userEmail,
      "message": {
        "_id": rand,
        "rid": room,
        "msg": parsedMessage
      }
    })
        .then(function (response) {
          Logger.info(response.data);
        })
        .catch(function (error) {
          console.log(error);
          Logger.error(error);
        });
  } catch (err) {
    Logger.error(`Exception while invoking method sendGroupChatMsg ${err.stack}`);
  }
}
