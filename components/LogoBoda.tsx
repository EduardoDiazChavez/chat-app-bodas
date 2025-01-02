import Image from "next/image";
import { FC } from "react";
import Logo from '../public/logo.png'

interface propsLedIndicator {
  width?: number
  height: number
}




export const LogoBoda: FC<propsLedIndicator> = ({ width, height }) =>
  <>
    <img
      alt="Logo-BodasDeHoy"
      src={Logo.src}
      className="object-scale-down"
      width={width}
      height={height}
    />
  </>
  ;
