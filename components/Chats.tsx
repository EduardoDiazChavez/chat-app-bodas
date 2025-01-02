import { FC, useEffect, useState } from "react";
import Profile from '../assets/img/profile.png';
import { ChatContextProvider } from '../context'
import { Section } from './Section'
import { Buscador } from './Buscador'
// Import Swiper React components
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import { Scrollbar, Navigation, Pagination } from "swiper";
// Import Swiper styles
import 'swiper/css';
import "swiper/css/bundle";
import Button from "./Button";
import { getRelativeTime } from "../utils/FormatTime";

import { data } from '../utils/data'
import { HandleChats, HandleContacts, HandleEvents } from "../handles";

interface propsChats {
  active: boolean
  setActive: any
  setChat: any
}
interface propsSlideto {
  page: number
  setResultsContact: any
  contacts: any
}



const SlideTo: FC<propsSlideto> = ({ page, setResultsContact, contacts }) => {
  const swiper = useSwiper();
  swiper.on('slideChange', function (idx) {
    if (idx.activeIndex != 1) {
      setResultsContact(contacts?.results)
    }
  });
  useEffect(() => {
    swiper.slideTo(page)
  }, [page, swiper])
  return <>
  </>
}

const A: FC<propsChats> = ({ active, setActive, setChat }) => {
  const [page, setPage] = useState(0)
  const [chatId, setChatId] = useState(null)
  const [contactUid, setContactUid] = useState(null)
  const { chats, contacts, events } = ChatContextProvider()

  const [resultsContact, setResultsContact]: any = useState()
  useEffect(() => {
    setResultsContact(contacts?.results)
  }, [contacts])

  const resultsEvents = events?.results
  useEffect(() => {
    if (chatId) {
      const chat: any = chats?.results?.filter((elem: any) => elem?._id == chatId)[0]
      setChat({ ...chat })
      return
    }
  const contact = contacts?.results?.filter((elem: any) => elem?.uid == contactUid)[0]
  const chatFilter = chats?.results?.filter((elem: any) => elem?.title == contact?.nickName)[0]
  const chat: any = {
    title: contact?.nickName,
    photoURL: contact?.photoURL,
    type: 'chatevents',
    addedes: [{
      type: "participante",
      userUid: contactUid
    }]
  }
    setChat(chatFilter ? { ...chatFilter } : { ...chat })
  }, [active, setChat, chats, chatId, contactUid, contacts])


  const handleScroll = (event: any) => {
    console.log('scrollTop: ', event.currentTarget.scrollTop);
    console.log('offsetHeight: ', event.currentTarget.offsetHeight);
  };
  const className = "block bg-primary text-white w-1/3 text-sm p-1 transition hover:opacity-90 pt-2"

  return (
    <>
      <div className={`${active ? "" : "hidden"} lg:flex col-span-12 lg:col-span-3 w-full h-full chats flex-col flex items-center justify-start overflow-auto pt-1 `}>
        
        <Buscador  />
        <div className="flex w-full pt-1 ">
            <Button className={className} onClick={() => { setPage(0) }} title="Chats" />
            <Button className={className} onClick={() => { setPage(1), setResultsContact(contacts?.results) }} title="Contactos" />
            <Button className={className} onClick={() => { setPage(2) }} title="Eventos" />
        </div>
  
        
        <div className="w-full h-full bg-white  ">
          <div className="col-span-12 lg:col-span-3 calHeight2">
            <Swiper key={1} className="bg-white"
              // pagination={{ dynamicBullets: true, type: 'bullets', clickable: true }}
              preloadImages={false}
              lazy={true}
              scrollbar={{ hide: false, dragClass: 'swiper-scrollbar-drag-modified', horizontalClass: 'swiper-scrollbar-horizontal-modified' }}
              modules={[Pagination, Scrollbar]}
            >
              <SlideTo page={page} setResultsContact={setResultsContact} contacts={contacts} />
              <SwiperSlide className="w-full calHeight3 pb-3 overscroll-contain" onScroll={handleScroll}>
                {
                  chats?.results?.map((item: any, idx: any) => (
                    <Section key={idx} onClick={() => { HandleChats(setActive, setChatId, item?._id) }} image={item.photoURL} name={item.title} info={getRelativeTime(item.updatedAt)} _id={item._id} onLine={item.onLine.status} />
                  ))
                }
              </SwiperSlide>
              <SwiperSlide className="w-full  calHeight3 pb-3 overscroll-contain">
                {
                  resultsContact?.length > 0 && resultsContact?.map((item: any, idx: any) => (
                    <Section key={idx} onClick={() => { HandleContacts({ setPage, setActive, setContactUid, setChatId, item }) }} image={item.photoURL} name={item.nickName} info={`${item.events.map(((it: any) => it.nombre)).toString().replace(/,/g, ", ")}`} _id={item._id} onLine={item.onLine.status} />
                  ))
                }
              </SwiperSlide>
              <SwiperSlide className="w-full calHeight3 pb-3 overscroll-contain">
                {
                  resultsEvents?.map((item, idx) => (
                    <Section key={idx} onClick={() => { HandleEvents({ setPage, setResultsContact, contacts, item }) }} image={Profile} name={item.nombre} info={item._id} _id={item._id} />
                  ))
                }
              </SwiperSlide>
            </Swiper>
          </div>
        </div>
      </div>
      <style jsx>
        {`
          .calHeight {
            height: calc(100vh - 4rem);
            //background: #f7628c; // color rojo
          }
          .calHeight2 {
            height: calc(100vh - 8.5rem);
            overflow: scroll;
            //background: #ffffff;
          }
          .calHeight3 {
            height: calc(100vh - 8.5rem);
            overflow: scroll;
            //background: #f0f0f0;
          }
          .swiper-scrollbar-horizontal-modified {
            position: absolute;
            left: 0%;
            bottom: 0px;
            z-index: 50;
            height: 5px;
            width: 393.5px;
            lef: 0;
            top: 0;
            background: #f7628c;
            border-radius: 0px;
          }
          .swiper-scrollbar-drag-modified {
            height: 100%;
            width: 50%;
            position: relative;
            background: hwb(343deg 64% 2%);
            border-radius: 0px;
            left: 0;
            top: 0;
          }
          .chats {
            height: calc(100vh - 4rem);
          }
          ::-webkit-scrollbar {
            display: none;
          }

        `}
      </style>
    </>
  );
};

export default A;



