import React, {
  createContext,
  useReducer,
} from 'react';

import Users from '/imports/api/users';
import Auth from '/imports/ui/services/auth';
import Storage from '/imports/ui/services/storage/session';
import ChatLogger from '/imports/ui/components/chat/chat-logger/ChatLogger';
import { _ } from 'lodash';

const CHAT_CONFIG = Meteor.settings.public.chat;
const PUBLIC_CHAT_KEY = CHAT_CONFIG.public_id;
const PUBLIC_GROUP_CHAT_KEY = CHAT_CONFIG.public_group_id;
const SYSTEM_CHAT_TYPE = CHAT_CONFIG.type_system;
const CLOSED_CHAT_LIST_KEY = 'closedChatList';

export const ACTIONS = {
  TEST: 'test',
  ADDED: 'added',
  CHANGED: 'changed',
  REMOVED: 'removed',
  LAST_READ_MESSAGE_TIMESTAMP_CHANGED: 'last_read_message_timestamp_changed',
  INIT: 'initial_structure',
};

const ROLE_MODERATOR = Meteor.settings.public.user.role_moderator;

export const getGroupingTime = () => Meteor.settings.public.chat.grouping_messages_window;
export const getGroupChatId = () => Meteor.settings.public.chat.public_group_id;
export const getLoginTime = () => (Users.findOne({ userId: Auth.userID }) || {}).loginTime || 0;

const generateTimeWindow = (timestamp) => {
  const groupingTime = getGroupingTime();
  dateInMilliseconds = Math.floor(timestamp);
  groupIndex = Math.floor(dateInMilliseconds / groupingTime)
  date = groupIndex * 30000;
  return date;
}

export const ChatContext = createContext();

const generateStateWithNewMessage = ({ msg, senderData }, state) => {
  
  const timeWindow = generateTimeWindow(msg.timestamp);
  const userId = msg.sender.id;
  const keyName = userId + '-' + timeWindow;
  const msgBuilder = ({msg, senderData}, chat) => {
    const msgTimewindow = generateTimeWindow(msg.timestamp);
    const key = msg.sender.id + '-' + msgTimewindow;
    const chatIndex = chat?.chatIndexes[key];
    const {
      _id,
      ...restMsg
    } = msg;

    const indexValue = chatIndex ? (chatIndex + 1) : 1;
    const messageKey = key + '-' + indexValue;
    const tempGroupMessage = {
      [messageKey]: {
        ...restMsg,
        key: messageKey,
        lastTimestamp: msg.timestamp,
        read: msg.chatId === PUBLIC_CHAT_KEY && msg.timestamp <= getLoginTime() ? true : false,
        content: [
          { id: msg.id, name: msg.sender.name, text: msg.message, time: msg.timestamp },
        ],
      }
    };
  
    return [tempGroupMessage, msg.sender, indexValue];
  };

  let stateMessages = state[msg.chatId];
  
  if (!stateMessages) {
    if (msg.chatId === getGroupChatId()) {
      state[msg.chatId] = {
        count: 0,
        chatIndexes: {},
        preJoinMessages: {},
        posJoinMessages: {},
        unreadTimeWindows: new Set(),
        unreadCount: 0,
      };
    } else {
      state[msg.chatId] = {
        count: 0,
        lastSender: '',
        chatIndexes: {},
        messageGroups: {},
        unreadTimeWindows: new Set(),
        unreadCount: 0,
      };
      stateMessages = state[msg.chatId];
    }

    stateMessages = state[msg.chatId];
  }
  
  const forPublicChat = msg.timestamp < getLoginTime() ? stateMessages.preJoinMessages : stateMessages.posJoinMessages;
  const forPrivateChat = stateMessages.messageGroups;
  const messageGroups = msg.chatId === getGroupChatId() ? forPublicChat : forPrivateChat;
  const timewindowIndex = stateMessages.chatIndexes[keyName];
  const groupMessage = messageGroups[keyName + '-' + timewindowIndex];
  
  if (!groupMessage || (groupMessage && groupMessage.sender.id !== stateMessages.lastSender.id)) {

    const [tempGroupMessage, sender, newIndex] = msgBuilder({msg, senderData}, stateMessages);
    stateMessages.lastSender = sender;
    stateMessages.chatIndexes[keyName] = newIndex;
    stateMessages.lastTimewindow = keyName + '-' + newIndex;
    ChatLogger.trace('ChatContext::formatMsg::msgBuilder::tempGroupMessage', tempGroupMessage);
    
    const messageGroupsKeys = Object.keys(tempGroupMessage);
    messageGroupsKeys.forEach(key => {
      messageGroups[key] = tempGroupMessage[key];
      const message = tempGroupMessage[key];
      if (message.sender.id !== Auth.userID && !message.id.startsWith(SYSTEM_CHAT_TYPE)) {
        stateMessages.unreadTimeWindows.add(key);
      }
    });
  } else {
    if (groupMessage) {
      if (groupMessage.sender.id === stateMessages.lastSender.id) {
        const previousMessage = msg.timestamp <= getLoginTime();
        const timeWindowKey = keyName + '-' + stateMessages.chatIndexes[keyName];
        messageGroups[timeWindowKey] = {
          ...groupMessage,
          lastTimestamp: msg.timestamp,
          read: previousMessage ? true : false,
          content: [
            ...groupMessage.content,
            { id: msg.id, name: groupMessage.sender.name, text: msg.message, time: msg.timestamp }
          ],
        };
        if (!previousMessage && groupMessage.sender.id !== Auth.userID) {
          stateMessages.unreadTimeWindows.add(timeWindowKey);
        }
      }
    }
  }

  return state;
}

const reducer = (state, action) => {  
  switch (action.type) {
    case ACTIONS.TEST: {
      ChatLogger.debug(ACTIONS.TEST);
      return {
        ...state,
        ...action.value,
      };
    }
    case ACTIONS.ADDED: {
      ChatLogger.debug(ACTIONS.ADDED);
      
      const batchMsgs = action.value;
      const closedChatsToOpen = new Set();
      const currentClosedChats = Storage.getItem(CLOSED_CHAT_LIST_KEY) || [];
      const loginTime = getLoginTime();
      const newState = batchMsgs.reduce((acc, i)=> {
        const message = i.msg;
        const chatId = message.chatId;
        if (
            chatId !== PUBLIC_GROUP_CHAT_KEY 
            && message.timestamp > loginTime
            && currentClosedChats.includes(chatId) ){
          closedChatsToOpen.add(chatId)
        }

        return generateStateWithNewMessage(i, acc);
      }, state);

      if (closedChatsToOpen.size) {
        const closedChats = currentClosedChats.filter(chatId => !closedChatsToOpen.has(chatId));
        Storage.setItem(CLOSED_CHAT_LIST_KEY, closedChats);
      }
      // const newState = generateStateWithNewMessage(action.value, state);
      return {...newState};
    }
    case ACTIONS.CHANGED: {
      return {
        ...state,
        ...action.value,
      };
    }
    case ACTIONS.REMOVED: {
      ChatLogger.debug(ACTIONS.REMOVED);
      if (state[PUBLIC_GROUP_CHAT_KEY]){
        state[PUBLIC_GROUP_CHAT_KEY] = {
          count: 0,
          lastSender: '',
          chatIndexes: {},
          preJoinMessages: {},
          posJoinMessages: {},
          unreadTimeWindows: new Set(),
          unreadCount: 0,
        };
      }
      return state;
    }
    case ACTIONS.LAST_READ_MESSAGE_TIMESTAMP_CHANGED: {
      ChatLogger.debug(ACTIONS.LAST_READ_MESSAGE_TIMESTAMP_CHANGED);
      const { timestamp, chatId } = action.value;
      const newState = {
        ...state,
      };
      const selectedChatId = chatId === PUBLIC_CHAT_KEY ? PUBLIC_GROUP_CHAT_KEY : chatId;
      const chat = state[selectedChatId];
      ['posJoinMessages','preJoinMessages','messageGroups'].forEach( messageGroupName => {
        const messageGroup = chat[messageGroupName];
        if (messageGroup){
          const timeWindowsids = Object.keys(messageGroup);
          timeWindowsids.forEach( timeWindowId => {
            const timeWindow = messageGroup[timeWindowId];
            if(timeWindow) {
              if (!timeWindow.read) {
                if (timeWindow.lastTimestamp <= timestamp){
                  newState[selectedChatId].unreadTimeWindows.delete(timeWindowId);

                  newState[selectedChatId][messageGroupName][timeWindowId] = {
                    ...timeWindow,
                    read: true,
                  };

                  
                  newState[selectedChatId] = {
                    ...newState[selectedChatId],
                  };
                  newState[selectedChatId][messageGroupName] = {
                    ...newState[selectedChatId][messageGroupName],
                  };
                  newState[chatId === PUBLIC_CHAT_KEY ? PUBLIC_GROUP_CHAT_KEY : chatId][messageGroupName][timeWindowId] = {
                    ...newState[selectedChatId][messageGroupName][timeWindowId],
                  };
                }
              }
            }
          });
        }
      });
      return newState;
    }
    case ACTIONS.INIT: {
      ChatLogger.debug(ACTIONS.INIT);
      const { chatId } = action;
      const newState = { ...state };

      if (!newState[chatId]){
        newState[chatId] = {
          count: 0,
          lastSender: '',
          chatIndexes: {},
          messageGroups: {},
          unreadTimeWindows: new Set(),
          unreadCount: 0,
        };
      }
      return state;
    }
    default: {
      throw new Error(`Unexpected action: ${JSON.stringify(action)}`);
    }
  }
};

export const ChatContextProvider = (props) => {
  const [chatContextState, chatContextDispatch] = useReducer(reducer, {});
  ChatLogger.debug('dispatch', chatContextDispatch);
  return (
    <ChatContext.Provider value={
      {
        dispatch: chatContextDispatch,
        chats: chatContextState,
        ...props,
      }
    }
    >
      {props.children}
    </ChatContext.Provider>
  );
}


export const ContextConsumer = Component => props => (
  <ChatContext.Consumer>
    {contexts => <Component {...props} {...contexts} />}
  </ChatContext.Consumer>
);

export default {
  ContextConsumer,
  ChatContextProvider,
}