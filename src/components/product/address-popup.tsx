import AddressAuto from '../auth/address-auto';
import { useUserContext } from '../preppers/context';
import Button from '../ui/button';
import Input from '../ui/forms/input';
import { useState, useEffect } from 'react';
import { useModalAction } from '../modal-views/context';

export default function AddressPopup() {
  const { location, setLocation } = useUserContext();
  const [data, setData] = useState<any>({});
  const { closeModal } = useModalAction();

  useEffect(() => {
    setData(location);
  }, [location]);
  const setAddress = (val: any) => {
    setData({ ...location, ...val });
  };

  const confirmSet = () => {
    setLocation(data);
    closeModal();
  };

  return (
    <div className="flex max-w-full flex-col bg-light text-left dark:bg-dark-250 xs:max-w-[430px] sm:max-w-[550px] md:max-w-[600px] lg:max-w-[960px] xl:max-w-[1200px] 3xl:max-w-[1460px]">
      <div className="-mx-2.5 flex flex-wrap items-center bg-light-300 py-3 pl-4 pr-16 dark:bg-dark-100 md:py-4 md:pl-6 lg:-mx-4 lg:py-5 xl:pl-8">
        <h2
          title={'address popup'}
          className="truncate px-2.5 py-1 text-base font-medium text-dark dark:text-light md:text-lg lg:w-[400px] lg:pl-4 lg:pr-5 xl:w-[520px] 3xl:w-[555px] 3xl:text-xl"
        >
          <span className="transition-colors hover:text-brand">
            Show me meal preppers that deliver to
          </span>
        </h2>
      </div>
      <div className="flex flex-col p-4 md:p-6 lg:flex-row lg:space-x-7 xl:space-x-8 xl:p-8 3xl:space-x-10">
        <div className="flex shrink-0 flex-col justify-between text-13px lg:w-[400px] xl:w-[520px] 3xl:w-[555px]">
          <div className="pb-7 xs:pb-8 lg:pb-10">
            <AddressAuto onSelect={setAddress} />

            <hr className="my-6" />

            <Input
              label="Address"
              type="text"
              value={data.address}
              onChange={(e) => setData({ ...data, address: e.target.value })}
              disabled={!data.latitude}
            />
            <div className="my-4 flex flex-col gap-5 sm:flex-row">
              {/* <Input
                label="Latitude"
                inputClassName="bg-light-100 dark:bg-dark-100"
                className="flex-1"
                type="text"
                value={data.latitude}
                onChange={() => {}}
                disabled={true}
              /> */}
              <Input
                label="Postcode"
                inputClassName="bg-light-100 dark:bg-dark-100"
                className="flex-1"
                type="text"
                value={data.postcode}
                onChange={() => {}}
                disabled={true}
              />
            </div>
          </div>
          <div className="mt-6 flex flex-row-reverse items-center gap-3 pb-4 md:flex-nowrap md:gap-3.5 lg:gap-4 3xl:pb-14">
            <Button onClick={confirmSet}>Set address</Button>
            <Button variant="outline" onClick={closeModal}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
