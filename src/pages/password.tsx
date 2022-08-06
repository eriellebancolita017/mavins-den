import type { ChangePasswordInput, NextPageWithLayout } from '@/types';
import type { SubmitHandler } from 'react-hook-form';
import { dehydrate, QueryClient, useMutation } from 'react-query';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import DashboardLayout from '@/layouts/_dashboard';
import { Form } from '@/components/ui/forms/form';
import Password from '@/components/ui/forms/password';
import Button from '@/components/ui/button';
import client from '@/data/client';
import { fadeInBottom } from '@/lib/framer-motion/fade-in-bottom';
import * as yup from 'yup';
import { useState } from 'react';
import { API_ENDPOINTS } from '@/data/client/endpoints';
import { useUserContext } from '@/components/preppers/context';

export const getStaticProps = async () => {
  const queryClient = new QueryClient();
  // await queryClient.prefetchQuery(
  //   [API_ENDPOINTS.SETTINGS],
  //   client.settings.all
  // );
  return {
    props: {
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  };
};
const changePasswordSchema = yup.object().shape({
  old_password: yup.string().required(),
  new_password: yup.string().min(6).required(),
  conform_password: yup
    .string()
    .oneOf([yup.ref('new_password')], 'Passwords must match')
    .required(),
  user_id: yup.string(),
  type: yup.string(),
  code: yup.string(),
});

const ChangePasswordPage: NextPageWithLayout = () => {
  let [error, setError] = useState<Partial<ChangePasswordInput> | null>(null);
  const { userInfo } = useUserContext();
  const { mutate, isLoading } = useMutation(client.users.changePassword, {
    onSuccess: (data) => {
      console.log('data', data);
      if (data.status !== '200') {
        setError({ old_password: data.error! });
        toast.error(<b>Current password is incorrect</b>, {
          className: '-mt-10 xs:mt-0',
        });
        return;
      }
      toast.success(<b>Password successfully updated!</b>, {
        className: '-mt-10 xs:mt-0',
      });
    },
    onError: (error: any) => {
      toast.error(
        <b>
          {error.response?.data?.error?.message ||
            'Current password is incorrect'}
        </b>,
        {
          className: '-mt-10 xs:mt-0',
        }
      );
    },
  });
  const onSubmit: SubmitHandler<ChangePasswordInput> = (data) => {
    console.log('data', data);
    mutate({
      ...data,
      type: 'consumer',
      code: 'EN',
      user_id: userInfo.consumer_id,
    });
  };
  return (
    <motion.div
      variants={fadeInBottom()}
      className="flex min-h-full flex-grow flex-col"
    >
      <h1 className="mb-5 text-15px font-medium text-dark dark:text-light sm:mb-6">
        Change Password
      </h1>
      <Form<ChangePasswordInput & { conform_password: string }>
        onSubmit={onSubmit}
        validationSchema={changePasswordSchema}
        serverError={error}
        className="flex flex-grow flex-col"
      >
        {({ register, reset, formState: { errors } }) => (
          <>
            <fieldset className="mb-6 grid gap-5 pb-5 sm:grid-cols-2 md:pb-9 lg:mb-8">
              <Password
                label="Current Password"
                {...register('old_password')}
                error={
                  errors.old_password?.message &&
                  'Current password is incorrect'
                }
              />
              <Password
                label="New Password"
                {...register('new_password')}
                error={errors.new_password?.message}
              />
              <Password
                label="Confirm Password"
                {...register('conform_password')}
                error={errors.conform_password?.message}
              />
            </fieldset>
            <div className="mt-auto flex items-center gap-4 pb-3 lg:justify-end">
              <Button
                type="reset"
                variant="outline"
                disabled={isLoading}
                onClick={() => reset()}
                className="flex-1 lg:flex-none"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={isLoading}
                disabled={isLoading}
                className="flex-1 lg:flex-none"
              >
                Save Change
              </Button>
            </div>
          </>
        )}
      </Form>
    </motion.div>
  );
};

ChangePasswordPage.authorization = true;
ChangePasswordPage.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default ChangePasswordPage;
