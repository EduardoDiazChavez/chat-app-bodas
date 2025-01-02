import { Chat, Contact, Notification, Event } from '../interfaces/';
import { SetStateAction, useEffect, useState, useCallback } from 'react';
import { queries } from '../utils/Fetching';
import { AuthContextProvider, SocketContextProvider, NotificationContextProvider } from '.';
import { createContext, FC, Dispatch, useContext } from "react";
import useFetch from '../hooks/useFetch';
import { HandleCreateChat, HandleDataContacts, HandleDataNotifications, HandleDataEvents, HandleReceivesMessage } from '../handles'

interface stateConversation {
  state: boolean;
  data: Chat | null;
}
interface ResultFetchChats {
  received?: number | null;
  total: number | null;
  results: Chat[];
}
interface ResultFetchContacts {
  total: number | null;
  results: Contact[];
}
interface ResultFetchNotifification {
  total: number | null;
  results: Notification[];
}
interface ResultFetchEvent {
  total: number | null;
  results: Event[];
}

type Context = {
  chats: ResultFetchChats
  setChats: Dispatch<SetStateAction<ResultFetchChats>>
  loadingChats?: boolean
  errorChats?: boolean
  fetch?: any
  fetchy?: any
  conversation?: stateConversation | null,
  setConversation: Dispatch<SetStateAction<stateConversation>>
  show?: boolean,
  setShow: Dispatch<SetStateAction<boolean>>,
  contacts: ResultFetchContacts,
  setContacts: Dispatch<SetStateAction<ResultFetchContacts>>
  notifications: ResultFetchNotifification;
  setNotifications: Dispatch<SetStateAction<Partial<Context | null>>>
  events: ResultFetchEvent;
  setEvents: Dispatch<SetStateAction<Partial<Context | null>>>
};

const initialContext: Context = {
  chats: { received: 0, total: null, results: [] },
  setChats: () => null,
  loadingChats: false,
  errorChats: false,
  fetch: () => { },
  fetchy: () => { },
  conversation: null,
  setConversation: () => { },
  show: false,
  setShow: () => { },
  contacts: { total: null, results: [] },
  setContacts: () => null,
  notifications: { total: null, results: [] },
  setNotifications: () => { },
  events: { total: null, results: [] },
  setEvents: () => { }
};

const ChatContext = createContext<Context>(initialContext);
const initialState = { state: false, data: null };

const ChatProvider: FC = ({ children }): JSX.Element => {
  const { user } = AuthContextProvider()
  const { socket, socketApp } = SocketContextProvider();
  const [limit, setLimit] = useState(20)
  const [skip, setSkip] = useState(0)
  const [show, setShow] = useState(false)
  const [conversation, setConversation] = useState<stateConversation>(initialState);
  const [isMounted, setIsMounted] = useState(false)
  const [chats, setChats, loadingChats, errorChats, fetchy] = useFetch({
    query: queries.getChats,
    variables: { uid: user?.uid },
  });
  const [contacts, setContacts, loadingContacts, errorContacts, fetchyApp] = useFetch({
    query: queries.getChats,
    variables: { uid: user?.uid },
    apiRoute: "graphqlApp"
  });
  const [notifications, setNotifications, loadingNotifications, errorNotifications, fetchyNotifications] = useFetch({
    query: queries.getChats,
    variables: { uid: user?.uid },
    apiRoute: "graphqlApp"
  });
  const [events, setEvents, loadingEvents, errorEvents, fetchyEvents] = useFetch({
    query: queries.getEventsGuess,
    variables: { uid: user?.uid },
    apiRoute: "graphqlApp"
  });
  const fetch = () => {
    fetchy({ query: queries.getChats, variables: { uid: user?.uid, origin: "chatevents", limit, skip } });
  }

  useEffect(() => {
    if (!isMounted && chats?.total > 0 && contacts?.total > 0) {
      setIsMounted(true)
      const resultsReduce = chats.results.reduce((acc: any, item: any) => {
        const itemFilter = contacts.results.filter((elem: any) => elem.uid == item.addedes[0]?.userUid)[0]
        const itemNew = {
          ...item, title: itemFilter?.nickName, photoURL: itemFilter?.photoURL
        }
        acc.push(itemNew)
        return acc
      }, [])
      const resultsOrder = resultsReduce.sort((a: any, b: any) => a.updateAt - b.updateAt)
      const chatsNew = {
        received: 0,
        total: chats.total,
        results: resultsOrder
      }
      setChats(chatsNew)
    }
  }, [chats, contacts, isMounted, setChats]);

  useEffect(() => {
    fetchy({ query: queries.getChats, variables: { uid: user?.uid, origin: "chatevents", limit, skip } });
    fetchyApp({ query: queries.getContacts, variables: { uid: user?.uid }, apiRoute: "graphqlApp" })
    fetchyEvents({ query: queries.getEventsGuess, variables: { uid: user?.uid }, apiRoute: "graphqlApp" })
  }, [user?.uid]);

  const handleCreateChat = (() => {
    // console.log(11223311, contacts)
    return HandleCreateChat({ setConversation, setChats, userUid: user?.uid ? user?.uid : "", contacts })
  })()
  const handleReceivesMessage = (() => {
    // console.log(11223311, contacts)
    return HandleReceivesMessage({ setChats })
  })()
  const handleDataContacts = HandleDataContacts(setContacts)
  const handleDataNotifications = HandleDataNotifications(setNotifications)
  const handleDataEvents = HandleDataEvents(setEvents)

  useEffect(() => {
    socket?.on("chatEvents:create", handleCreateChat)
    socket?.on("chatEvents:message", handleReceivesMessage)
    return () => {
      socket?.off("chatEvents:create")
      socket?.off("chatEvents:message")
    }
  }, [socket, handleCreateChat, handleReceivesMessage]);

  // useEffect(() => {
  //   socket?.on("chatEvents:message", (data) => {
  //     const chatsNew = chats?.results?.map((elem: any) => {
  //       if (elem._id == data.chatID) {
  //         elem.messages.push(data)
  //       }
  //       return elem
  //     })
  //     console.log(chatsNew)
  //   })
  //   return () => {
  //     socket?.off('chatEvents:message')
  //   }
  // }, [socket, chats]);

  useEffect(() => {
    socketApp?.on("dataContact", handleDataContacts)
    socketApp?.on("dataNotification", handleDataNotifications)
    socketApp?.on("dataEvents", handleDataEvents)
    return () => {
      socketApp?.off('dataContact', handleDataContacts)
    }
  }, [socketApp, handleDataContacts, handleDataNotifications, handleDataEvents]);

  return (
    <ChatContext.Provider value={{ chats, setChats, loadingChats, errorChats, conversation, setConversation, fetchy, show, setShow, contacts, setContacts, notifications, setNotifications, events, setEvents }}>
      {children}
    </ChatContext.Provider>
  );
};

const ChatContextProvider = () => useContext(ChatContext);
export { ChatProvider, ChatContextProvider };
