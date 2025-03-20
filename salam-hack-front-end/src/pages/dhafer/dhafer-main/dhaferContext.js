import React, { createContext, useState, useEffect } from "react";
import { useSelector } from "react-redux";

import {
  Pages,
  getConversationIdFromSession,
  getConversations,
  getMessagesByConversation,
  getUserMemory,
} from "./dhaferLogic";

export const DhaferContext = createContext();

export const DhaferProvider = ({ children }) => {
  const conversationId = getConversationIdFromSession()?.conversationId;
  const user = useSelector((state) => state.currentUser);

  const [currentConversationId, setCurrentConversationId] =
    useState(conversationId);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [userMemory, setUserMemory] = useState(null);
  const [currentPage, setCurrentPage] = useState(
    conversationId ? Pages.CONVERSATION : Pages.WELCOME
  );
  const [responseLoader, setResponseLoader] = useState(false);
  const [pageLoader, setPageLoader] = useState(false);

  useEffect(() => {
    if (!user?.userId) return;

    const fetchData = async () => {
      try {
        if (conversations?.length === 0)
          setConversations(await getConversations(user?.userId, setPageLoader));

        if (!userMemory) setUserMemory(await getUserMemory(user?.userId));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [user?.userId]); // , conversations?.length

  useEffect(() => {
    if (!currentConversationId) return;

    const fetchData = async () => {
      const fetchedMessages = await getMessagesByConversation(
        currentConversationId,
        setPageLoader
      );

      if (fetchedMessages?.length > 0) {
        setMessages(
          fetchedMessages.map(({ messageId, sender, content }) => ({
            messageId,
            sender,
            content,
          }))
        );
      } else setMessages([]);
    };

    fetchData();
  }, [currentConversationId]);

  return (
    <DhaferContext.Provider
      value={{
        state: {
          user,
          currentConversationId,
          conversations,
          messages,
          userMemory,
          currentPage,
          responseLoader,
          pageLoader,
        },
        actions: {
          setCurrentConversationId,
          setConversations,
          setMessages,
          setUserMemory,
          setCurrentPage,
          setResponseLoader,
          setPageLoader,
        },
      }}
    >
      {children}
    </DhaferContext.Provider>
  );
};
