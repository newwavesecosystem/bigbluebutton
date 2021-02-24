import React, { PureComponent, useContext } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import TimeWindowChatItem from './component';
import { UsersContext } from '/imports/ui/components/components-data/users-context/context';
import ChatLogger from '/imports/ui/components/chat/chat-logger/ChatLogger';
import ChatService from '../../service';

const CHAT_CONFIG = Meteor.settings.public.chat;
const SYSTEM_CHAT_TYPE = CHAT_CONFIG.type_system;
const ROLE_MODERATOR = Meteor.settings.public.user.role_moderator;

const isDefaultPoll = (pollText) => {
  const pollValue = pollText.replace(/<br\/>|[ :|%\n\d+]/g, '');
  switch (pollValue) {
    case 'A': case 'AB': case 'ABC': case 'ABCD':
    case 'ABCDE': case 'YesNo': case 'TrueFalse':
      return true;
    default:
      return false;
  }
};
export default function TimeWindowChatItemContainer(props) {
  ChatLogger.debug('TimeWindowChatItemContainer::render', { ...props });
  const { message, messageId } = props;
  const usingUsersContext = useContext(UsersContext);
  const  { users } = usingUsersContext;
  const {
    sender,
    key,
    time,
    content,
    color,
  } = message;

  const messages = content;
  const user = users[sender?.id];
  const messageKey = key;
  return (
    <TimeWindowChatItem
      {
      ...{
        color: user?.color || color,
        isModerator: user?.role === ROLE_MODERATOR,
        isOnline: !!user,
        avatar: user?.avatar,
        name: user?.name || sender?.name,
        read: message.read,
        messages,
        isDefaultPoll,
        user,
        time,
        systemMessage: messageId.startsWith(SYSTEM_CHAT_TYPE) || !sender,
        messageKey,
        handleReadMessage: ChatService.updateUnreadMessage,
        ...props,
      }
      }
    />
  );
}
