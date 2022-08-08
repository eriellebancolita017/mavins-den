import * as yup from 'yup';
import type { SubmitHandler } from 'react-hook-form';
import type {
  ForgetPasswordInput,
  ResetPasswordInput,
  VerifyForgetPasswordTokenInput,
} from '@/types';
import toast from 'react-hot-toast';
import { Form } from '@/components/ui/forms/form';
import Input from '@/components/ui/forms/input';
import Password from '@/components/ui/forms/password';
import Button from '@/components/ui/button';
import { useModalAction } from '@/components/modal-views/context';
import { RegisterBgPattern } from '@/components/auth/register-bg-pattern';
import {
  StateMachineProvider,
  createStore,
  useStateMachine,
  GlobalState,
} from 'little-state-machine';
import client from '@/data/client';
import { useMutation } from 'react-query';
import { useState } from 'react';
import { useUserContext } from '../preppers/context';
import PhoneInput, { usePhoneInput } from '../ui/forms/phone-input';

const emailFormValidation = yup.object().shape({
  email: yup.string().email().required(),
});
const tokenFormValidation = yup.object().shape({
  token: yup.string().required(),
});
const passwordFormValidation = yup.object().shape({
  password: yup.string().required(),
});

function EmailForm({
  email,
  serverError,
  onSubmit,
  isLoading,
  setEmailMode,
  emailMode,
}: {
  email: string;
  serverError?: { email?: string } | null;
  onSubmit: SubmitHandler<ForgetPasswordInput>;
  isLoading: boolean;
  emailMode: boolean;
  setEmailMode: (val: boolean) => void;
}) {
  const { openModal } = useModalAction();
  return (
    <div className="px-6 pt-10 pb-8 sm:px-8 lg:p-12">
      <RegisterBgPattern className="absolute bottom-0 left-0 text-light dark:text-dark-300 dark:opacity-60" />
      <div className="relative z-10 flex items-center">
        <div className="w-full shrink-0 text-left md:w-[380px]">
          <div className="flex flex-col pb-5 text-center lg:pb-9 xl:pb-10 xl:pt-2">
            <h2 className="text-lg font-medium tracking-[-0.3px] text-dark dark:text-light lg:text-xl">
              Reset Your Password
            </h2>
            {/* <div className="mt-1.5 text-13px leading-6 tracking-[0.2px] dark:text-light-900 lg:mt-2.5 xl:mt-3">
              We&apos;ll send you a link to reset your password
            </div> */}
            <button
              onClick={() => setEmailMode(!emailMode)}
              className="mt-4 inline-flex self-end text-13px font-semibold leading-6 text-brand hover:text-dark-400 hover:dark:text-light-500"
            >
              {!emailMode ? 'Use email instead' : 'Use phone number instead'}
            </button>
          </div>
          <Form<ForgetPasswordInput>
            onSubmit={onSubmit}
            useFormProps={{
              defaultValues: { email },
            }}
            serverError={serverError}
            // validationSchema={emailFormValidation}
            className="text-left"
          >
            {({ register, formState: { errors } }) => (
              <>
                {emailMode ? (
                  <Input
                    label="Email"
                    type="email"
                    {...register('email')}
                    error={
                      errors.email?.message &&
                      'your email is not exists in our app'
                    }
                  />
                ) : (
                  <div>
                    <span className="block cursor-pointer pb-2.5 text-left text-13px font-normal text-dark/70 dark:text-light/70">
                      Phone Number
                    </span>
                    <PhoneInput />
                  </div>
                )}

                <Button
                  type="submit"
                  className="!mt-5 w-full text-sm tracking-[0.2px] lg:!mt-6"
                  isLoading={isLoading}
                  disabled={isLoading}
                >
                  Reset Password
                </Button>
              </>
            )}
          </Form>
          <div className="relative mt-10 flex items-center justify-center border-t border-light-500 text-13px dark:border-dark-600">
            <span className="absolute inline-flex bg-light px-2 pb-0.5 dark:bg-dark-300">
              Or
            </span>
          </div>
          <div className="pt-7 text-center text-13px">
            Back to{' '}
            <button
              type="button"
              className="font-semibold text-brand hover:text-dark-400 hover:dark:text-light-500"
              onClick={() => openModal('LOGIN_VIEW')}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TokenForm({
  token,
  message,
  serverError,
  onSubmit,
  isLoading,
  onBack,
}: {
  token: string;
  message: string | null;
  serverError: { token?: string } | null;
  onSubmit: SubmitHandler<Pick<VerifyForgetPasswordTokenInput, 'token'>>;
  isLoading: boolean;
  onBack: () => void;
}) {
  return (
    <div className="px-6 pt-10 pb-8 sm:px-8 lg:p-12">
      <RegisterBgPattern className="absolute bottom-0 left-0 text-light dark:text-dark-300 dark:opacity-60" />
      <div className="relative z-10">
        {message && (
          <div className="flex flex-col pb-5 text-center lg:pb-9 xl:pb-10 xl:pt-2">
            <h2 className="text-lg font-medium tracking-[-0.3px] text-dark dark:text-light lg:text-xl">
              Check Your Email
            </h2>
            <div className="mt-1.5 text-13px leading-6 tracking-[0.2px] dark:text-light-900 lg:mt-2.5 xl:mt-3">
              We sent you a token to reset your password
            </div>
          </div>
        )}
        <Form<Pick<VerifyForgetPasswordTokenInput, 'token'>>
          onSubmit={onSubmit}
          useFormProps={{
            defaultValues: { token },
          }}
          validationSchema={tokenFormValidation}
          serverError={serverError}
        >
          {({ register, formState: { errors } }) => (
            <div className="w-full xs:w-[380px]">
              <Input
                label="Enter Token"
                {...register('token')}
                error={errors.token?.message && 'Invalid token'}
                className="text-left"
              />
              <div className="mt-7 grid grid-cols-2 gap-5 text-13px">
                <Button type="reset" variant="outline" onClick={onBack}>
                  Back
                </Button>
                <Button
                  type="submit"
                  isLoading={isLoading}
                  disabled={isLoading}
                >
                  Verify Token
                </Button>
              </div>
            </div>
          )}
        </Form>
      </div>
    </div>
  );
}

function PasswordForm({
  onSubmit,
  isLoading,
  onBack,
}: {
  onSubmit: SubmitHandler<Pick<ResetPasswordInput, 'password'>>;
  isLoading: boolean;
  onBack: () => void;
}) {
  return (
    <div className="px-6 pt-10 pb-8 sm:px-8 lg:p-12">
      <RegisterBgPattern className="absolute bottom-0 left-0 text-light dark:text-dark-300 dark:opacity-60" />
      <div className="relative z-10">
        <div className="flex flex-col pb-5 text-center lg:pb-9 xl:pb-10 xl:pt-2">
          <h2 className="text-lg font-medium tracking-[-0.3px] text-dark dark:text-light lg:text-xl">
            Reset Password
          </h2>
          <div className="mt-1.5 text-13px leading-6 tracking-[0.2px] dark:text-light-900 lg:mt-2.5 xl:mt-3">
            Almost there to reset your password
          </div>
        </div>
        <Form<Pick<ResetPasswordInput, 'password'>>
          onSubmit={onSubmit}
          useFormProps={{
            defaultValues: { password: '' },
          }}
          validationSchema={passwordFormValidation}
        >
          {({ register, formState: { errors } }) => (
            <div className="w-full xs:w-[380px]">
              <Password
                label="New Password"
                {...register('password')}
                error={errors.password?.message}
                className="text-left"
              />
              <div className="mt-7 grid grid-cols-2 gap-5 text-13px">
                <Button type="reset" variant="outline" onClick={onBack}>
                  Back
                </Button>
                <Button
                  type="submit"
                  isLoading={isLoading}
                  disabled={isLoading}
                >
                  Send
                </Button>
              </div>
            </div>
          )}
        </Form>
      </div>
    </div>
  );
}

function RenderFormSteps() {
  const { openModal } = useModalAction();
  const [message, setMessage] = useState<string | null>(null);
  const [emailMode, setEmailMode] = useState(true);
  const { phoneNumber } = usePhoneInput();
  const [error, setError] = useState<{ token?: string; email?: string } | null>(
    null
  );
  const { mutate: forgotPassword, isLoading } = useMutation(
    client.users.forgotPassword
  );
  const { mutate: verifyForgotPasswordToken, isLoading: verifying } =
    useMutation(client.users.verifyEmailOpt);

  const { mutate: verifyToken, isLoading: tokenVerifying } = useMutation(
    client.users.verifyOpt
  );

  const { mutate: resetPassword, isLoading: resetting } = useMutation(
    client.users.resetPassword
  );
  // use hook for getting form state and actions
  const { state, actions } = useStateMachine({ updateFormState });

  const emailFormHandle: SubmitHandler<ForgetPasswordInput> = ({ email }) => {
    forgotPassword(
      {
        type: 'consumer',
        lang_code: 'EN',
        request_type: emailMode ? 'email' : 'mobile',
        ...(emailMode
          ? { email }
          : {
              mobile: phoneNumber?.substring(2),
              mobile_country_code: '+44',
            }),
      },
      {
        onSuccess: (data) => {
          if (error) {
            setError({ email: 'error' });
            return;
          }
          // setMessage(data.message);
          actions.updateFormState({
            email: email || 'none',
            step: 'Token',
          });
        },
      }
    );
  };

  const passwordFormHandle: SubmitHandler<
    Pick<ResetPasswordInput, 'password'>
  > = ({ password }) => {
    resetPassword(
      {
        new_password: password,
        conform_password: password,
        request_type: emailMode ? 'email' : 'mobile',
        type: 'consumer',
        ...(emailMode
          ? {
              email: state.email,
            }
          : {
              mobile: phoneNumber?.substring(2),
              mobile_country_code: '+44',
            }),
      },
      {
        onSuccess: (res) => {
          if (!res.error) {
            actions.updateFormState({
              ...initialState,
            });
            toast.success(<b>Password successfully reset!</b>, {
              className: '-mt-10 xs:mt-0',
            });
            openModal('LOGIN_VIEW');
          }
        },
      }
    );
  };

  const tokenFormHandle: SubmitHandler<
    Pick<VerifyForgetPasswordTokenInput, 'token'>
  > = ({ token }) => {
    if (emailMode) {
      verifyForgotPasswordToken(
        {
          email_verification_code: +token,
          email: state.email,
          code: 'EN',
          type: 'consumer',
        },
        {
          onSuccess: (res) => {
            actions.updateFormState({
              step: 'Password',
              token,
            });
          },
          onError: (error: any) => {
            console.log('error', error.response.data.error.message);
            setError({ token: error.response.data.error.message });
            return;
          },
        }
      );
    } else {
      verifyToken(
        {
          otp: +token,
          request_type: 'forgot',
          mobile: phoneNumber?.substring(2),
          mobile_country_code: '+44',
          code: 'EN',
          type: 'consumer',
        },
        {
          onSuccess: (res) => {
            actions.updateFormState({
              step: 'Password',
              token,
            });
          },
          onError: (error: any) => {
            console.log('error', error.response.data.error.message);
            setError({ token: error.response.data.error.message });
            return;
          },
        }
      );
    }
  };
  function backToPreviousStep(step: GlobalState['step']) {
    actions.updateFormState({
      step,
    });
  }
  return (
    <div>
      {state.step === 'Email' && (
        <EmailForm
          email={state.email}
          onSubmit={emailFormHandle}
          serverError={error}
          isLoading={isLoading}
          emailMode={emailMode}
          setEmailMode={setEmailMode}
        />
      )}
      {state.step === 'Token' && (
        <TokenForm
          token={state.token}
          onSubmit={tokenFormHandle}
          message={message}
          serverError={error}
          isLoading={verifying}
          onBack={() => backToPreviousStep('Email')}
        />
      )}
      {state.step === 'Password' && (
        <PasswordForm
          onSubmit={passwordFormHandle}
          isLoading={resetting}
          onBack={() => backToPreviousStep('Token')}
        />
      )}
    </div>
  );
}

const initialState: GlobalState = {
  step: 'Email',
  email: '',
  password: '',
  token: '',
};
//@ts-ignore
createStore(initialState);

const updateFormState = (
  state: typeof initialState,
  payload: {
    step: 'Email' | 'Token' | 'Password' | 'Success' | 'Error';
    [key: string]: string;
  }
) => {
  return {
    ...state,
    ...payload,
  };
};

export default function ForgotUserPassword() {
  return (
    <StateMachineProvider>
      <RenderFormSteps />
    </StateMachineProvider>
  );
}
