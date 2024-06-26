/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useRef } from 'react';
import { useInView } from 'react-intersection-observer';

import { useGetConversations } from '../../../shared/hooks/useGetConversations';
import { useFilterConversations } from '../../../shared/hooks/useFilterConversations';
import useConversation from '../../../store/useConversation';

import { generateEmoji, uniqueSender } from '../../../shared/utils/index';
import { emojiUser } from '../../../shared/data';

import Conversation from './Conversation';

const Conversations = ({ toggleSidebar }) => {
  const conversationRef = useRef(null);
  const { ref: lastConversationRef } = useInView({
    threshold: 0,
  });

  const { isLoading, conversations } = useGetConversations();
  const { selectedConversation, notification } = useConversation();

  const filteredConversation = useFilterConversations(
    conversations,
    selectedConversation?.data,
    'private'
  );

  const nonFilteredConversations = useConversation((state) =>
    state.conversations.filter((conversation) =>
      state.selectedConversation ? conversation._id !== state.selectedConversation?.data?._id : true
    )
  );

  const unreadMessagesCounts = uniqueSender(notification);

  const filterNotification = (id) =>
    unreadMessagesCounts.filter(
      ({ sender, receiver }) => sender._id === id && receiver.fullName !== undefined
    );

  // keep emoji values stable when rerendering, using useMemo for performance optimization
  const generateConversationsWithEmoji = useMemo(() => {
    return conversations.map((conversation) => ({
      ...conversation,
      emoji: generateEmoji(emojiUser),
    }));
  }, [conversations]);

  // scroll to selected or searched conversations
  useEffect(() => {
    const timerId = setTimeout(() => {
      conversationRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 500);
    return () => clearTimeout(timerId);
  }, []);

  return (
    <>
      <ul className='flex flex-col mt-4 p-2 gap-2 overflow-auto touch-auto will-change-scroll'>
        {isLoading ? <span className='loading loading-spinner'></span> : null}

        {filteredConversation.length > 0 &&
          filteredConversation.map((conversation) => (
            <li key={conversation._id} ref={conversationRef} className='w-full'>
              <Conversation
                filtered={true}
                conversation={conversation}
                // If the emoji is not found (i.e., if it's undefined), the generateEmoji() function is called to generate a new emoji. This ensures that each conversation has a stable emoji associated with it, even if the conversation data changes.
                emoji={
                  generateConversationsWithEmoji.find((c) => c._id === conversation._id)?.emoji ||
                  generateEmoji(emojiUser)
                }
                filteredNotification={filterNotification(conversation._id)}
                toggleSidebar={toggleSidebar}
              />
            </li>
          ))}

        {nonFilteredConversations.map((conversation, idx) => (
          <Conversation
            key={conversation._id}
            lastIdx={idx === conversations.length - 1} // if last conversation - don`t show divider
            conversation={conversation}
            emoji={
              generateConversationsWithEmoji.find((c) => c._id === conversation._id)?.emoji ||
              generateEmoji(emojiUser)
            }
            filteredNotification={filterNotification(conversation._id)}
            toggleSidebar={toggleSidebar}
          />
        ))}

        <div ref={lastConversationRef}></div>
      </ul>
    </>
  );
};

export default Conversations;
