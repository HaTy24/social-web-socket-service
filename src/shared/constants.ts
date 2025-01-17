export enum WS_TOPIC {
  SEND_MESSAGE = 'send_message',
  REPLY_MESSAGE = 'reply_message',
  READ_MESSAGE = 'read_message',
  DELETE_MESSAGE = 'delete_message',
  NOTIFICATION = 'notification',
}

export const DEFAULT_WS_ACK_TIMEOUT = 10000;

export const WS_PORT = 8080;

export const INJECTION_TOKEN = {
  AUDIT_SERVICE: Symbol.for('AUDIT_SERVICE'),
  HTTP_SERIVCE: Symbol.for('HTTP_SERVICE'),
};

export enum USER_STATUS {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

export enum NOTIFICATION_CONTENT_TYPE {
  SHARES_TRANSACTION = 'shares_transaction',
}

export enum CHAT_MESSAGE_TYPE {
  SEND_MESSAGE = 'send_message',
  REPLY_MESSAGE = 'reply_message',
  READ_MESSAGE = 'read_message',
  DELETE_MESSAGE = 'delete_message',
  ACK_MESSAGE_RECEIVED = 'ack_message_received',
}

export enum NOTIFICATION_MESSAGE_TYPE {
  PUSH_MESSAGE = 'push_message',
  ACK_NOTIFICATION_RECEIVED = 'ack_notification_received',
}

export enum CHAT_TYPE {
  SINGLE = 'single',
  GROUP = 'group',
}

export enum NOTIFICATION_TYPE {
  PUSH_NOTIFICATION = 'push_notification', // Appears on the notification bell icon. Nothing
}

export enum ENV_KEY {
  NODE_ENV = 'NODE_ENV',
  AUDIT_GATEWAY_URL = 'AUDIT_GATEWAY_URL',
  AUDIT_GATEWAY_USERNAME = 'AUDIT_GATEWAY_USERNAME',
  AUDIT_GATEWAY_PASSWORD = 'AUDIT_GATEWAY_PASSWORD',
  API_BACKEND_URL = 'API_BACKEND_URL',
  API_BACKEND_AUTH_SECRET = 'API_BACKEND_AUTH_SECRET',
  MONGO_URI = 'MONGO_URI',
}

export const ERR_CODE = {
  CHAT_NOT_FOUND: 'CHAT_NOT_FOUND'.toLowerCase(),
};

export const APP_ACTION = {
  SEND_HTTP_RESPONSE: 'SEND_HTTP_RESPONSE'.toLowerCase(),
  HANDLE_CHAT_MESSAGE: 'HANDLE_CHAT_MESSAGE'.toLowerCase(),
  HANDLE_NOTIFICATION_MESSAGE: 'HANDLE_NOTIFICATION_MESSAGE'.toLowerCase(),
  CREATE_CHAT: 'CREATE_CHAT'.toLowerCase(),
  PAGINATE_USER_CHATS: 'PAGINATE_USER_CHATS'.toLowerCase(),
  FIND_USER_BY_ID: 'FIND_USER_BY_ID'.toLowerCase(),
  POPULATE_CHAT_PARTICIPANTS: 'POPULATE_CHAT_PARTICIPANTS'.toLowerCase(),
  POPULATE_CHAT_INFORMATION: 'POPULATE_CHAT_INFORMATION'.toLowerCase(),
  COUNT_UNREAD_MESSAGES: 'COUNT_UNREAD_MESSAGES'.toLowerCase(),
  HANDLE_SEND_CHAT: 'HANDLE_SEND_CHAT'.toLowerCase(),
  HANDLE_ACK_CHAT_MESSAGE: 'HANDLE_ACK_CHAT_MESSAGE'.toLowerCase(),
  MARK_MESSAGE_AS_READ: 'MARK_MESSAGE_AS_READ'.toLowerCase(),
  MARK_NOTIFICATION_AS_READ: 'MARK_NOTIFICATION_AS_READ'.toLowerCase(),
  AUTHORIZE_USER: 'AUTHORIZE_USER'.toLowerCase(),
  SEND_CHAT_MESSAGE_TO_USERS: 'SEND_CHAT_MESSAGE_TO_USERS'.toLowerCase(),
  SEND_NOTIFICATION_TO_USERS: 'SEND_NOTIFICATION_TO_USERS'.toLowerCase(),
  REPLY_TO_USER_MESSAGE: 'REPLY_TO_USER_MESSAGE'.toLowerCase(),
  DELETE_MESSAGE: 'DELETE_MESSAGE'.toLowerCase(),
  JOIN_USER_SOCKET: 'JOIN_USER_SOCKET'.toLowerCase(),
  HANDLE_USER_CONNECTION: 'HANDLE_USER_CONNECTION'.toLowerCase(),
  COUNT_UNREAD_NOTIFICATIONS: 'COUNT_UNREAD_NOTIFICATIONS'.toLowerCase(),
  ADD_MESSAGE_TO_CHAT: 'ADD_MESSAGE_TO_CHAT'.toLowerCase(),
  PARSE_NOTIFICATION_INFORMATION:
    'PARSE_NOTIFICATION_INFORMATION'.toLowerCase(),
};
