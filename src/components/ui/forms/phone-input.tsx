import 'react-phone-input-2/lib/style.css';
import ReactPhone from 'react-phone-input-2';
import { atom, useAtom } from 'jotai';
import { useEffect } from 'react';

const phoneNumberAtom = atom('');
export function usePhoneInput() {
  let [phoneNumber, setPhoneNumber] = useAtom(phoneNumberAtom);
  return {
    phoneNumber,
    setPhoneNumber,
  };
}

export default function PhoneInput({
  className,
  defaultValue,
  disabled,
}: {
  className?: string;
  defaultValue?: string;
  disabled?: boolean;
}) {
  let { phoneNumber, setPhoneNumber } = usePhoneInput();
  useEffect(() => {
    if (defaultValue) {
      setPhoneNumber(defaultValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className={className}>
      <ReactPhone
        country={'gb'}
        value={phoneNumber}
        onChange={(value) => setPhoneNumber(value)}
        disableDropdown
        countryCodeEditable={false}
        disabled={disabled}
      />
    </div>
  );
}

export { ReactPhone };
