import { useRef, useState, useEffect, ComponentType, Dispatch } from "react"
import BoxChat from "../components/BoxChat"
import Chats from '../components/Chats'
import ContactInfo from "../components/ContactInfo"
import { useSwipeable } from 'react-swipeable'
import PageLogin from './Pagelogin'
import { AuthContextProvider, ChatContextProvider, SocketContextProvider } from '../context';
import { Navigation } from "../components/Surface/Navigation";
import { useRouter } from "next/router"
import { fetchApi, queries } from "../utils/Fetching";
import BoxChatIni from "../components/BoxChatIni"


import { AppProps, ThemeChat, SendMessage, ResultChats } from "chat-component-library/dist"
import dynamic from "next/dynamic"
import { HandleSendMessage } from "../handles"
import { api } from "../api"
import { LogoBoda } from "../components/LogoBoda"
import { Profile } from "../components/Profile"
import { Notification } from "../components/Notification"

const ChatApp: ComponentType<AppProps> = dynamic(
  () => import('chat-component-library/dist').then((mode) => {
    return mode.App
  }),
  {
    ssr: false,
  }
);

const themeChat: ThemeChat = {
  primaryColor: "#F7628C",
  secondaryColor: "#87F3B5",
  tertiaryColor: "#49516F",
  baseColor: "#F2F2F2",
}


const portals = {
  results: [],
  total: 0
}



const token: string = "eyJhbGciOiJSUzI1NiIsImtpZCI6ImNlOWI4ODBmODE4MmRkYTU1N2Y3YzcwZTIwZTRlMzcwZTNkMTI3NDciLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiQm9kYXNkZWhveS5jb20iLCJwaWN0dXJlIjoiaHR0cHM6Ly9hcGkuYm9kYXNkZWhveS5jb20vdXBsb2Fkcy8zY2RjMzYva2lzc3BuZy10dXhlZG8tcGVuZ3Vpbi1kZXNrdG9wLXdhbGxwYXBlci1saW51eC10dXgtNWIzZDNmNjRjNmQ2OTMuMjc1NjQ3MzMxNTMwNzQwNTgwODE0NS1pNjQwLndlYnAiLCJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vYm9kYXNkZWhveS0xMDYzIiwiYXVkIjoiYm9kYXNkZWhveS0xMDYzIiwiYXV0aF90aW1lIjoxNjczMzYwOTQxLCJ1c2VyX2lkIjoiZHJxcnJrTjBMU2ZPNGs3T3VpalpBdnRGTjgxMyIsInN1YiI6ImRycXJya04wTFNmTzRrN091aWpaQXZ0Rk44MTMiLCJpYXQiOjE2NzMzNjA5NDEsImV4cCI6MTY3MzM2NDU0MSwiZW1haWwiOiJmZWJtZXJsaWJAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZ29vZ2xlLmNvbSI6WyIxMTMzMDE5ODIwOTM5MzM0NDI4MTQiXSwiZW1haWwiOlsiZmVibWVybGliQGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6Imdvb2dsZS5jb20ifX0.QpB0Amwv3wbwaCVmHl9T-BhTbDJZs4jIt6__N5xknSr2fccKtkYXmJvQXxKO-zOePEavdZVBZ2uAHDchWK1JvwRj0z8BIxpr2pc1YrJiJv5_V0Ia5w7N2u_tpgpPrZ5JZR-7mDVLM4sEGrDE-9PxxqFHD6KN3yXGzaEHzR8k3DC7ZMzEx-9oI1VcSJ3-gV3mEchNcGHqqok8PWqatL-zRIAh_bYgVFIjNoOJ2zYhfiIsZ78YkShPHkBali97BpzoYwxO4xg_st7jh73ygyDPq0PxpCSca-FySi0nQnDw5NhrrogdcDdTJsgspmKgkvDlOr4weYqUo2vDivobbK8WWA"

export default function Home() {
  const r = useRouter()
  const { emailPassword, setEmailPassword, user, verificandoCookie } = AuthContextProvider()
  const { chats, setChats, show, setShow, contacts, events } = ChatContextProvider();
  const { socket } = SocketContextProvider();


  const sendMessage: Dispatch<SendMessage> = ({ chat, message, type }) => {
    HandleSendMessage({
      messageSend: message,
      chat: chat,
      userUid: user?.uid ? user.uid : "",
      setChats: setChats,
      setChat: setChat,
      socket: socket,
    })
  }


  const handleSearchChat = async (value: string): Promise<ResultChats> => {
    const query = queries.getChats
    const variables = { origin: "chatevents", uid: user?.uid, text: value, skip: 0, limit: 5 }
    const { data: { data } } = await api.graphql({ query, variables })
    console.log(789456, data?.getChats)
    return data?.getChats
  };

  const [montado, setMontado] = useState(false)
  useEffect(() => {
    fetchApi({
      query: queries.getSignInStatus,
      variables: { uid: r?.query?.uid },
    }).then((value: any) => {
      !value && setEmailPassword(r?.query)
      /////setEmailPassword(r?.query)
    })
  }, [r?.query, setEmailPassword]);

  const [active, setActive] = useState(0)
  const [chat, setChat] = useState(null)
  useEffect(() => {
  }, [chat]);
  const handler = useSwipeable({

    onSwipedRight: (eventdata) => {
      if (active <= 2 && active > 0) {
        setActive(active - 1)
      }
    }
  })

  const myRef = useRef();
  const refPassthrough = (el: any) => {
    handler.ref(el);
    myRef.current = el;
  }
  if (verificandoCookie) {
    if (!user) {
      return <PageLogin valir={!emailPassword?.email} />
    }
    // if (!user && r?.query?.email && r?.query?.password && r?.query?.uid) {
    //   return <>hola</>
    // }
    return (
      <>
        {/* <Navigation /> */}
        <div className="bg-red-500 w-full section">
          <ChatApp
            userUid={user?.uid ? user.uid : ""}
            label="MovilDemo: "
            token={token}
            theme={themeChat}
            chats={chats}
            contacts={contacts}
            events={events} portals={portals}
            notifications={[]}
            sendMessage={sendMessage}
            getScraperMetaData={handleSearchChat}
            elementLogo={
              <span className="ml-2">
                <LogoBoda width={160} height={100} />
              </span>
            }
            elementPerfil={
              <span className="mr-2">
                <Profile />
              </span>
            }
            elementNotifications={
              <Notification valir={true} value={5} onClick={() => { }} />
            }
          />

          {/* <section {...handler} ref={refPassthrough} className="grid grid-cols-12 bg-base mx-auto inset-x-0 ">
            {<Chats active={active == 0} setActive={setActive} setChat={setChat} />}
            {active == 0 && <BoxChatIni active={active == 0} />}
            {active != 0 && <BoxChat active={active == 1} chat={chat ? chat : null} setChat={setChat} />}
            {<ContactInfo active={active == 2} />}
          </section> */}
        </div>
        <style jsx>
          {`
              .section {
                //height: calc(100vh - 4rem);
                height: calc(100vh );
              }
              .calHeight1 {
                height: calc(100vh - 8rem);
                overflow: scroll;
              }
              `}
        </style>
      </>
    )
  }
  return <></>
}