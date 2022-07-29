import * as yup from 'yup';
import type { SubmitHandler } from 'react-hook-form';
import type { RegisterUserInput } from '@/types';
import { useMutation } from 'react-query';
import toast from 'react-hot-toast';
import { Form } from '@/components/ui/forms/form';
import Password from '@/components/ui/forms/password';
import { useModalAction } from '@/components/modal-views/context';
import Input from '@/components/ui/forms/input';
import client from '@/data/client';
import Button from '@/components/ui/button';
import { RegisterBgPattern } from '@/components/auth/register-bg-pattern';
import { useState, useRef } from 'react';
import useAuth from './use-auth';
import PhoneInput, { usePhoneInput } from '@/components/ui/forms/phone-input';
import { useUserContext } from '../preppers/context';
import { ServerErrors } from '@/components/ui/forms/form';

const registerUserValidationSchema = yup.object().shape({
  name: yup.string().max(20).required(),
  email: yup.string().email().required(),
  password: yup.string().required().min(6),
  mobile: yup.string(),

  register_type: yup.string(),
  mobile_country_code: yup.string(),
  otp: yup.number().min(4).required(),
  code: yup.string(),
  device_id: yup.string(),
  device_token: yup.string(),
  device_type: yup.string(),
  device_name: yup.string(),
  user_type: yup.string(),
});

export default function RegisterUserForm() {
  const { openModal, closeModal } = useModalAction();
  const { authorize } = useAuth();
  const { location, setUserInfo } = useUserContext();
  const { phoneNumber } = usePhoneInput();
  const [codeSent, setCodeSent] = useState(false);
  const [time, setTime] = useState(0);
  const timerRef = useRef<any>();
  const timeTempRef = useRef<number>(0);

  let [serverError, setServerError] = useState<RegisterUserInput | null>(null);
  const { mutate, isLoading } = useMutation(client.users.register, {
    onSuccess: (res) => {
      if (!res.payload.consumer_id) {
        toast.error(<b>Something went wrong</b>, {
          className: '-mt-10 xs:mt-0',
        });
        return;
      }
      toast.success(<b>Successfully Signed up.</b>, {
        className: '-mt-10 xs:mt-0',
      });

      authorize(res.payload.consumer_id);
      setUserInfo(res.payload);
      closeModal();
    },
    onError: (err: any) => {
      toast.error(<b>Something went wrong</b>, {
        className: '-mt-10 xs:mt-0',
      });
      setServerError(err.response.data);
    },
  });

  const { mutate: optMutate, isLoading: optLoading } = useMutation(
    client.users.getOpt,
    {
      onSuccess: (res) => {
        if (!res.payload.otp) {
          toast.error(<b>Something went wrong</b>, {
            className: '-mt-10 xs:mt-0',
          });
          return;
        }
        toast.success(<b>Code Sent!</b>, {
          className: '-mt-10 xs:mt-0',
        });
        clearTimeout(timerRef.current);
        setCodeSent(true);
        setTime(0);
        timeTempRef.current = 0;
        timerRef.current = setInterval(() => {
          timeTempRef.current++;
          setTime(timeTempRef.current);

          if (timeTempRef.current === 60) {
            clearTimeout(timerRef.current);
            setCodeSent(false);
          }
        }, 1000);
      },
    }
  );
  const onSubmit: SubmitHandler<RegisterUserInput> = (data) => {
    clearTimeout(timerRef.current);
    mutate({
      ...data,

      register_type: 'email',
      mobile_country_code: '+44',
      code: 'EN',
      device_id: 'xxx',
      device_token: 'xxx',
      device_type: 'android',
      device_name: 'xxx',
      user_type: 'consumer',
      mobile: phoneNumber.substring(2),
    });
  };

  const codeClick = () => {
    optMutate({
      type: 'consumer',
      mobile: phoneNumber.substring(2),
      mobile_country_code: '+44',
      request_type: 'signUp',
      code: 'EN',
    });
  };

  return (
    <div className="px-6 pt-10 pb-8 sm:px-8 lg:p-12">
      <RegisterBgPattern className="absolute bottom-0 left-0 text-light dark:text-dark-300 dark:opacity-60" />
      <div className="relative z-10 flex items-center">
        <div className="w-full shrink-0 text-left md:w-[380px]">
          <div className="flex flex-col pb-5 text-center lg:pb-9 xl:pb-10 xl:pt-2">
            <h2 className="text-lg font-medium tracking-[-0.3px] text-dark dark:text-light lg:text-xl">
              Welcome Back, Get Login
            </h2>
            <div className="mt-1.5 text-13px leading-6 tracking-[0.2px] dark:text-light-900 lg:mt-2.5 xl:mt-3">
              Create your account. Already have account?{' '}
              <button
                onClick={() => openModal('LOGIN_VIEW')}
                className="inline-flex font-semibold text-brand hover:text-dark-400 hover:dark:text-light-500"
              >
                Login here
              </button>
            </div>
          </div>

          <Form<RegisterUserInput>
            onSubmit={onSubmit}
            validationSchema={registerUserValidationSchema}
            serverError={
              serverError as
                | ServerErrors<Partial<RegisterUserInput>>
                | null
                | undefined
            }
            className="space-y-4 lg:space-y-5"
          >
            {({ register, formState: { errors } }) => (
              <>
                <Input
                  label="Name"
                  inputClassName="bg-light dark:bg-dark-300"
                  {...register('name')}
                  error={errors.name?.message}
                />
                <div>
                  <span className="block cursor-pointer pb-2.5 text-13px font-normal text-dark/70 dark:text-light/70">
                    Phone Number
                  </span>
                  <PhoneInput />
                  {phoneNumber.substring(2)?.length !== 10 ? (
                    <span className="block pt-2 text-xs text-warning">
                      {!phoneNumber.substring(2)
                        ? 'Phone number is required'
                        : 'Please input correct phone number'}
                    </span>
                  ) : (
                    <p
                      onClick={() => codeClick()}
                      className="float-right mt-2 cursor-pointer text-sm font-semibold text-brand hover:text-brand-dark"
                    >
                      {!codeSent ? 'Send code' : 'Re-send code'}
                    </p>
                  )}
                </div>
                <Input
                  label="Verify your code"
                  inputClassName="bg-light dark:bg-dark-300"
                  type="number"
                  {...register('otp')}
                  error={errors.otp ? 'Code should be 4 digits' : ''}
                  disabled={optLoading || !codeSent}
                />
                {codeSent && (
                  <p className="float-right -translate-y-4 text-warning">{`00 : ${
                    60 - time >= 10 ? 60 - time : '0' + (60 - time)
                  }`}</p>
                )}
                <Input
                  label="Email"
                  inputClassName="bg-light dark:bg-dark-300"
                  type="email"
                  {...register('email')}
                  error={errors.email?.message}
                />
                <Password
                  label="Password"
                  inputClassName="bg-light dark:bg-dark-300"
                  {...register('password')}
                  error={errors.password?.message}
                />
                <Button
                  type="submit"
                  className="!mt-5 w-full text-sm tracking-[0.2px] lg:!mt-7"
                  disabled={isLoading}
                >
                  Register
                </Button>
              </>
            )}
          </Form>
        </div>
      </div>
    </div>
  );
}
