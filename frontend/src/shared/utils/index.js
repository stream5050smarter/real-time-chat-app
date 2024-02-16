import { emojiBook } from '../data/index';

// generate random emoji
export const generateEmoji = () => {
  const emodjiList = emojiBook.length;

  const randomIdx = Math.floor(Math.random() * emodjiList);

  return emojiBook[randomIdx];
};

// for message time
export const extractTime = (dateStr) => {
  const date = new Date(dateStr);
  const hours = padZero(date.getHours());
  const minutes = padZero(date.getMinutes());
  return `${hours}:${minutes}`;
};

// pad single-digit numbers with a leading zero
function padZero(num) {
  return num.toString().padStart(2, '0');
}

// for last messages
export const unreadMessagesCount = (msges, id) => {
  let unreadCount = 0;

  if (id) {
    unreadCount = Array.isArray(msges)
      ? msges.filter(({ lastMessage }) => lastMessage.senderId === id && !lastMessage.read).length
      : 0;
  } else {
    unreadCount = Array.isArray(msges)
      ? msges.filter(({ lastMessage }) => !lastMessage.read).length
      : 0;
  }

  return unreadCount > 0 ? (unreadCount > 9 ? '9+' : unreadCount.toString()) : null;
};
