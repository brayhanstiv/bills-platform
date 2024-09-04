// Packages
import React from "react";
import { Button, Input, Link, Divider } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import {
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";

// Firebase Authentication
import { auth, googleProvider } from "../../firebase_config";

const LoginPage = () => {
  // Hooks
  const navigate = useNavigate();
  const [email, setEmail] = React.useState<string>();
  const [password, setPassword] = React.useState<string>();

  const signInWithEmail = async () => {
    try {
      console.log(email);
      console.log(password);
      const result = await signInWithEmailAndPassword(auth, email!, password!);
      const user = result.user;

      if (!user) {
        await sendEmailVerification(auth.currentUser!, {
          url: "http://localhost:4000/login",
        });
        await signOut(auth);
        navigate("/login");
        return;
      }

      localStorage.setItem("user", JSON.stringify(user));

      navigate("/admin/home");
    } catch (error) {
      console.log("Unexpected error: ", error);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      if (!user) {
        signOut(auth);
        navigate("/auth/login");
      }

      localStorage.setItem("user", JSON.stringify(user));

      navigate("/admin/home");
    } catch (error) {
      console.error("Unexpected error: ", error);
    }
  };

  return (
    <div className='flex h-full w-full items-center justify-center'>
      <div className='flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 pb-10 pt-6 shadow-small'>
        <p className='pb-2 text-xl font-medium'>Iniciar sesión</p>
        <form
          className='flex flex-col gap-3'
          onSubmit={(e) => e.preventDefault()}
        >
          <Input
            label='Correo electrónico'
            name='email'
            type='email'
            variant='bordered'
            onValueChange={setEmail}
          />
          <Input
            label='Contraseña'
            name='password'
            type='password'
            variant='bordered'
            onValueChange={setPassword}
          />
          <Button
            color='primary'
            startContent={
              <Icon
                className='pointer-events-none text-2xl'
                icon='solar:letter-bold'
              />
            }
            type='submit'
            onPress={signInWithEmail}
          >
            Continuar con Email
          </Button>
        </form>
        <div className='flex items-center gap-4 py-2'>
          <Divider className='flex-1' />
          <p className='shrink-0 text-tiny text-default-500'>O</p>
          <Divider className='flex-1' />
        </div>
        <div className='flex flex-col gap-2'>
          <Button
            startContent={<Icon icon='logos:google-icon' width={24} />}
            variant='flat'
            onPress={signInWithGoogle}
          >
            Continuar con Google
          </Button>
        </div>
        <p className='text-center text-small'>
          ¿Necesitas crear una cuenta?&nbsp;
          <Link href='#' size='sm' onPress={() => navigate("/register")}>
            Registrarse
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
