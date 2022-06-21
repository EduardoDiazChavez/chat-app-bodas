import { FC, MouseEventHandler, useContext } from "react";
import { GoogleProvider, FacebookProvider, auth } from "../../firebase";
import { Icon } from "../Surface/Footer";
import { AppleIcon, FacebookIcon, GoogleIcon } from "../Icons";
import { signInWithPopup, UserCredential } from "firebase/auth";
import router from "next/router";
import { GraphQL, fetchApi, queries } from "../../utils/Fetching";
import { useToast } from "../../hooks/useToast";
import { AuthContextProvider, LoadingContextProvider } from "../../context";
//import { setCookie } from "../../utils/Cookies";
import { api } from "../../api";
import { useAuthentication } from "../../utils/Authentication";

interface propsRegisterQuestion {
  onClick: MouseEventHandler;
}
export const RegisterQuestion: FC<propsRegisterQuestion> = ({ onClick }) => {
  return (
    <h2 className={`font-light text-tertiary flex gap-2 items-center text-sm `}>
      ¿No dispones de una cuenta?
      <span
        className="text-primary font-semibold cursor-pointer hover:text-tertiary transition"
        onClick={onClick}
      >
        Regístrate
      </span>
    </h2>
  );
};

export const Providers: FC<any> = ({ setStage }) => {


  const { signIn } = useAuthentication();
  const toast = useToast();
  const { setLoading } = LoadingContextProvider();

  const handleClick = async (provider: any) => {
    try {
      signIn("provider", provider);
    } catch (error) {
      setLoading(false);
      toast("error", JSON.stringify(error));
      console.log(error);
    }
  };

  const ListProviders = [
    {
      icon: <FacebookIcon className="w-5 h-5" />,
      function: () => handleClick(FacebookProvider),
    },
    {
      icon: <GoogleIcon className="w-5 h-5" />,
      function: () => handleClick(GoogleProvider()),
    },
    {
      icon: <AppleIcon className="w-5 h-5" />,
      function: () => alert("Aun por configurar"),
    },
  ];

  return (
    <div className={`text-center flex flex-col gap-2 w-full items-center `}>
      <h1 className="text-primary">Accede con</h1>
      <div className="gap-4 flex items-center">
        {ListProviders.map((item, idx) => (
          <Icon key={idx} icon={item.icon} onClick={item.function} />
        ))}
      </div>
    </div>
  );
};

export const BusinessAccess: FC = () => {
  return (
    <div className="w-full text-center h-max text-gray-500">
      <p>¿Eres profesional?</p>
      <h3 className="text-primary font-medium cursor-pointer hover:text-tertiary transition">
        Acceso para empresas
      </h3>
    </div>
  );
};
