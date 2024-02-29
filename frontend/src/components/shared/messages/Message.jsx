import { useAuthContext } from '../../../shared/context/AuthContext';
import useConversation from '../../../store/useConversation';

import { extractTime } from '../../../shared/utils';

import Icon from '../../ui/Icon';
import AudioPlayer from '../audio/AudioPlayer';

const Message = ({ message }) => {
  const { authUser } = useAuthContext();
  const { selectedConversation } = useConversation();

  const fromMe = message.sender._id === authUser._id;

  const chatClassName = fromMe ? 'chat-end' : 'chat-start';
  const chatColor = fromMe ? 'bg-beige/80' : 'bg-green/80';
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
    <>
      <div className={`chat ${chatClassName}`}>
        {' '}
        <div className='chat-image avatar'>
          <div className='w-10 rounded-full shadow-lg shadow-primary/40 border-[1px] border-green'>
            <img alt='user avatar' src={avatar} width='40px' height='40px' />
          </div>
        </div>
        <div
          className={`chat-bubble pb-2 text-slate-800 ${chatColor} ${shakeClass} overflow-hidden`}
        >
          {message.img && (
            <div className='w-32 h-20'>
              <img
                src={message.img}
                alt='message'
                width={128}
                height={80}
                onClick={() => document.getElementById(`${message._id}`).showModal()}
                className='w-full h-full object-contain'
              />
            </div>
          )}
          {message.audio && <AudioPlayer src={message.audio} />}
          {message.message}
        </div>
        <div className='chat-footer flex items-center gap-2 text-xs text-slate-400'>
          {messageStatus} {extractTime(message.createdAt)}
        </div>
      </div>
      <dialog id={`${message._id}`} className='modal'>
        <div className='modal-img modal-box'>
          <form method='dialog'>
            <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>✕</button>
          </form>
          <img
            src={message.img}
            alt='message'
            width={128}
            height={80}
            className='w-full h-full rounded-2xl object-cover'
          />
        </div>
      </dialog>
    </>
  );
};

export default Message;
