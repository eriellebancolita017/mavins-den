import { Address } from '@/types';

function removeFalsy(obj: any) {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => Boolean(v)));
}

export function formatAddress(address: Address) {
  if (!address) return;
  const temp = ['street_address', 'state', 'city', 'zip', 'country'].reduce(
    (acc, k) => ({ ...acc, [k]: (address as any)[k] }),
    {}
  );
  const formattedAddress = removeFalsy(temp);
  return Object.values(formattedAddress).join(', ');
}
