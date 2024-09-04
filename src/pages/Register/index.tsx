// Packages
import React from "react";
import { Button, Input } from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
} from "firebase/auth";

// Firebase Authentication
import { auth } from "../../firebase_config";

const RegisterPage = () => {
  // Hooks
  const navigate = useNavigate();
  const [email, setEmail] = React.useState<string>();
  const [password, setPassword] = React.useState<string>();

  const createUserWithEmail = async () => {
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email!,
        password!
      );
      const user = result.user;

      if (!user) {
        await sendEmailVerification(auth.currentUser!, {
          url: "http://localhost:4000/login",
        });
        await signOut(auth);
        navigate("/register");
        return;
      }

      navigate("/login");
    } catch (error) {
      console.log("Unexpected error: ", error);
    }
  };

  return (
    <div className='flex h-full w-full items-center justify-center'>
      <div className='flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 pb-10 pt-6 shadow-small'>
        <p className='pb-2 text-xl font-medium'>Registro</p>
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
            onPress={createUserWithEmail}
          >
            Registrarme
          </Button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
