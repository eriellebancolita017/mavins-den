import type { NextPageWithLayout, UpdateProfileInput } from '@/types';
import type { SubmitHandler } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import DashboardLayout from '@/layouts/_dashboard';
import { Form } from '@/components/ui/forms/form';
import Input from '@/components/ui/forms/input';
import Textarea from '@/components/ui/forms/textarea';
import { ReactPhone } from '@/components/ui/forms/phone-input';
import Button from '@/components/ui/button';
import client from '@/data/client';
import { fadeInBottom } from '@/lib/framer-motion/fade-in-bottom';
import { useMe } from '@/data/user';
import pick from 'lodash/pick';
import { API_ENDPOINTS } from '@/data/client/endpoints';
import Uploader from '@/components/ui/forms/uploader';
import * as yup from 'yup';
import PhoneInput, { usePhoneInput } from '@/components/ui/forms/phone-input';

const profileValidationSchema = yup.object().shape({
  consumer_id: yup.string().required(),
  name: yup.string().required(),
  mobile: yup.string(),
  // mobile_country_code: yup.string().required(),
  profile_photo: yup.string(),
});
const ProfilePage: NextPageWithLayout = () => {
  const queryClient = useQueryClient();
  const { me } = useMe();
  const { phoneNumber } = usePhoneInput();
  const { mutate, isLoading } = useMutation(client.users.update, {
    onSuccess: () => {
      toast.success(<b>Information successfully updated!</b>, {
        className: '-mt-10 xs:mt-0',
      });
    },
    onError: (error) => {
      toast.error(<b>Something went wrong!</b>, {
        className: '-mt-10 xs:mt-0',
      });
      console.log(error);
    },
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.USERS_ME);
    },
  });
  const onSubmit: SubmitHandler<UpdateProfileInput> = (data) => {
    // if (phoneNumber.length === 12 || phoneNumber.length === 13)
    mutate({
      name: data.name,
      user_id: me.consumer_id,
      type: 'consumer',
      code: 'EN',
      // mobile: phoneNumber.substring(phoneNumber.length - 10),
    });
    // else
    //   toast.error(<b>Please input correct phone number!</b>, {
    //     className: '-mt-10 xs:mt-0',
    //   });
  };

  return (
    <motion.div
      variants={fadeInBottom()}
      className="flex min-h-full flex-grow flex-col"
    >
      <h1 className="mb-5 text-15px font-medium text-dark dark:text-light sm:mb-6">
        Personal Information
      </h1>
      <Form<UpdateProfileInput>
        onSubmit={onSubmit}
        useFormProps={{
          defaultValues: pick(me, [
            'consumer_id',
            'name',
            'mobile',
            'mobile_country_code',
            'profile_photo',
          ]),
        }}
        validationSchema={profileValidationSchema}
        className="flex flex-grow flex-col"
      >
        {({ register, reset, control, formState: { errors } }) => (
          <>
            <fieldset className="mb-6 grid gap-5 pb-5 sm:grid-cols-2 md:pb-9 lg:mb-8">
              <Controller
                name="profile_photo"
                control={control}
                render={({ field: { ref, ...rest } }) => (
                  <div className="sm:col-span-2">
                    <span className="block cursor-pointer pb-2.5 font-normal text-dark/70 dark:text-light/70">
                      Avatar
                    </span>
                    <div className="text-xs">
                      <Uploader {...rest} multiple={false} />
                    </div>
                  </div>
                )}
              />
              <Input
                label="Name"
                {...register('name')}
                error={errors.name?.message}
              />
              <div>
                <span className="block cursor-pointer pb-2.5 font-normal text-dark/70 dark:text-light/70">
                  Phone Number
                </span>
                {/* <Controller
                  name="mobile"
                  control={control}
                  render={({ field }) => {console.log('mobile field', field)
                    return <ReactPhone country="gb" {...field} />}}
                /> */}
                <PhoneInput
                  defaultValue={me?.mobile_country_code + me?.mobile}
                  disabled
                />

                {errors.mobile?.message && (
                  <span
                    role="alert"
                    className="block pt-2 text-xs text-warning"
                  >
                    {'contact field is required'}
                  </span>
                )}
              </div>
              {/* <Textarea
                label="Bio"
                {...register('profile.bio')}
                error={errors.profile?.bio?.message && 'bio field is required'}
                className="sm:col-span-2"
              /> */}
            </fieldset>
            <div className="mt-auto flex items-center gap-4 pb-3 lg:justify-end">
              <Button
                type="reset"
                onClick={() =>
                  reset({
                    consumer_id: me?.consumer_id,
                    name: '',
                  })
                }
                disabled={isLoading}
                variant="outline"
                className="flex-1 lg:flex-none"
              >
                Cancel
              </Button>
              <Button
                className="flex-1 lg:flex-none"
                type="submit"
                isLoading={isLoading}
                disabled={isLoading}
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

ProfilePage.authorization = true;
ProfilePage.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default ProfilePage;
