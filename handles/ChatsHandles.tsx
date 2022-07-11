import { Chat, Contact, Notification } from '../interfaces/index';
import { SetStateAction, useEffect, useState, useCallback } from 'react';

export const HandleDataContacts = (setContacts: any) => {
  const handleDataContacts = useCallback((data: Contact) => {
    setContacts((old: { total: number, results: Contact[] }) => {
      const existContact = old?.results?.findIndex((item: Contact) => item._id === data._id)
      if (existContact >= 0) {
        const nuevo = old.results.map((oldContact => {
          if (oldContact._id === data._id) {
            return {
              ...oldContact,
              eventos: [...oldContact.eventos, data.eventos[0]]
            }
          }
          return oldContact
        }))
        return {
          ...old,
          results: nuevo
        }
      }
      return {
        total: old.total++,
        results: [...old.results, data]
      }
    });
  }, [setContacts])
  return handleDataContacts
}

export const HandleDataNotifications = (setNotifications: any) => {
  const handleDataNotifications = useCallback((data: Notification) => {
    console.log(123, data)
    setNotifications(data);
  }, [setNotifications])
  return handleDataNotifications
}

export const HandleCreateChat = (setConversation: any, setChats: any) => {
  const handleCreateChat = useCallback((data: Chat) => {
    setConversation({ state: true, data })
    setChats((old: any) => {
      if (old?.results?.findIndex((item: any) => item._id === data._id) === -1) {
        return {
          ...old,
          results: [data, ...old?.results]
        };
      } else {
        return old
      }
    });
  }, [setConversation, setChats])
  return handleCreateChat
}