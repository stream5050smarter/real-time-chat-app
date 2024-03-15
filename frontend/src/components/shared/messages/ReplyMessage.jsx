import Icon from '../../ui/Icon';

const ReplyMessage = ({ message, onReply }) => {
  return (
    <a
      href='#'
      role='button'
      className='flex items-center justify-start gap-2 text-slate-800 text-sm'
      onClick={() => onReply(message)}
    >
      <Icon src='#icon-forward' style='drop-shadow-1xl-black w-3 h-3' />
      Reply
    </a>
  );
};

export default ReplyMessage;
