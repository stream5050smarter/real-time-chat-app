import { useEffect, useState } from 'react';

import useConversation from '../../../store/useConversation';
import { useListenReadMessages } from '../../../shared/hooks/useListenReadMessages';
import { useListenMessages } from '../../../shared/hooks/useListenMessages';
import { useListenEmoji } from '../../../shared/hooks/useListenEmoji';

import NoChatSelected from './NoChatSelected';
import MessagesBlockHeader from './MessagesBlockHeader';
import MessagesBlockInput from './MessagesBlockInput';
import Messages from './Messages';
import LoadMoreMessages from './LoadMoreMessages';
import QuotedMessage from './message.data/reply/QuotedMessage';
import GroupConnectedClients from './GroupConnectedClients';

const MessagesBlock = ({ isOpen }) => {
  const [quotedMessage, setQuotedMessage] = useState(null);
  const [isShowQuotedMessage, setIsShowQuotedMessage] = useState(false);
  const [isShowGroupParticipants, setIsShowGroupParticipants] = useState(true);

  const handleClose = () => {
    setIsShowQuotedMessage(false);
    setQuotedMessage(null);
  };

  const handleReply = (message) => {
    setQuotedMessage(message);
    setIsShowQuotedMessage(true);
  };

  const toggleShowParticipants = () => {
    setIsShowGroupParticipants(!isShowGroupParticipants);
  };

  const { groups, selectedConversation, setSelectedConversation, isLoading } = useConversation();

  // listen socket events
  useListenMessages();
  useListenReadMessages();
  useListenEmoji();

  useEffect(() => {
    // cleanup function when unmounted component
    return () => {
      setSelectedConversation(null);
    };
  }, [setSelectedConversation]);

  const groupData = groups.find((group) => group._id === selectedConversation?.data?._id);

  return (
    <>
      {isOpen && (
        <div className='fixed top-0 right-0 md:relative md:right-auto flex flex-col items-center justify-start flex-grow p-4 pt-24 md:pt-10 max-w-full w-full h-full overflow-hidden touch-auto will-change-scroll bg-slate-300/10 brightness-105 bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-1'>
          {!selectedConversation ? (
            <NoChatSelected />
          ) : (
            <>
              <div className='relative w-full'>
                {' '}
                <MessagesBlockHeader
                  name={
                    selectedConversation?.type === 'private'
                      ? selectedConversation?.data.fullName
                      : groupData.chatName
                  }
                  data={
                    selectedConversation?.type === 'private'
                      ? selectedConversation?.data
                      : groupData
                  }
                  toggleShow={toggleShowParticipants}
                />
                <GroupConnectedClients isShow={isShowGroupParticipants} />
              </div>

              <Messages onReply={handleReply} />
              {!isLoading && <LoadMoreMessages />}
              <div className='flex flex-col items-center justify-center w-full'>
                {' '}
                {isShowQuotedMessage && (
                  <QuotedMessage
                    message={quotedMessage}
                    showButton='true'
                    onCloseQuote={handleClose}
                  />
                )}
                <MessagesBlockInput
                  onCloseQuote={handleClose}
                  isShowQuotedMessage={isShowQuotedMessage}
                  quotedMessage={quotedMessage}
                />
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default MessagesBlock;
