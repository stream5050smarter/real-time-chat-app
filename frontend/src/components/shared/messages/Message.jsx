import { lazy } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const ImageDialog = lazy(() => import('../../shared/messages/ImageDialog'));

import { useAuthContext } from '../../../shared/context/AuthContext';
import useConversation from '../../../store/useConversation';

import { extractTime } from '../../../shared/utils';

import Icon from '../../ui/Icon';
import AudioPlayer from '../audio/AudioPlayer';
import ImageMessage from './ImageMessage';
import QuotedMessage from './QuotedMessage';
import DropdownButton from '../../ui/DropdownButton';
import DropdownMessage from './DropdownMessage';
import DownloadImage from './DownloadImage';

const Message = ({ message, onReply, quotedMessage }) => {

  const { authUser } = useAuthContext();
  const { selectedConversation, messages } = useConversation();
  const { ref, inView } = useInView();

  const quotedInfo = messages.find((message) => message._id === quotedMessage);

  const fromMe = message.sender._id === authUser._id;

  const chatClassName = fromMe ? 'chat-end' : 'chat-start';
  const chatColor = fromMe ? 'bg-beige/80' : 'bg-green/80';
  const dropdownColor = fromMe ? 'bg-green' : 'bg-beige';
  const avatar = fromMe ? authUser.avatar : selectedConversation?.avatar;
  const isMsgRead = message.read;

  const messageStatus =
    isMsgRead && fromMe ? (
      <Icon src='#icon-checkmark-read' style='w-4 h-4 drop-shadow-3xl-red' />
    ) : (
      <Icon src='#icon-checkmark-send' style='w-4 h-4 drop-shadow-3xl-black' />
    );
  const shakeClass = message.shouldShake ? 'shake-msg' : '';

  return (
    <motion.div
      key={message._id}
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transition: 'all 250ms linear 250ms',
      }}
    >
      <div className={`chat ${chatClassName}`}>
        {' '}
        <div className='chat-image avatar'>
          <div className='w-10 rounded-full shadow-lg shadow-primary/40 border-[1px] border-green'>
            <img alt='user avatar' src={avatar} width='40px' height='40px' />
          </div>
        </div>
        <div
          className={`relative chat-bubble pb-2 text-slate-800 ${chatColor} ${shakeClass} flex flex-col items-center justify-center gap-1 selection:bg-accent/50`}
        >
          {quotedMessage && (
            <QuotedMessage
              message={quotedInfo || quotedMessage}
              dropdownColor={dropdownColor}
              fromMe={fromMe}
            />
          )}
          <DropdownButton>
            <DropdownMessage dropdownColor={dropdownColor} message={message} onReply={onReply} />
          </DropdownButton>
          {message.img && <DownloadImage message={message} />}
          <div className='relative flex items-center justify-between gap-2'>
            {message.img && <ImageMessage message={message} />}
            {message.audio && <AudioPlayer src={message.audio} />}
            {message.text}
          </div>
        </div>
        <div className='chat-footer flex items-center gap-2 text-xs text-slate-400'>
          {messageStatus} {extractTime(message.createdAt)}
        </div>
      </div>
      <ImageDialog message={message} />
    </motion.div>
  );
};

export default Message;
