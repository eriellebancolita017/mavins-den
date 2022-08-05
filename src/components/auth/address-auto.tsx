/* eslint-disable react/jsx-key */
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
import { useState } from 'react';

interface Props {
  onSelect: (value: any) => void;
}

export default function AddressAuto({ onSelect }: Props) {
  const [address, setAddress] = useState('');
  return (
    <PlacesAutocomplete
      value={address}
      onChange={(val) => setAddress(val)}
      onSelect={(address) => {
        geocodeByAddress(address).then((results) => {
          setAddress(address);
          if (results.length > 0) {
            const result = results[0];
            const postcode = result.address_components.find(
              (addr: any) => addr.types[0] === 'postal_code'
            )?.short_name;

            onSelect({
              address: result.formatted_address,
              latitude: result.geometry.location.lat(),
              longitude: result.geometry.location.lng(),
              postcode,
            });
          }
        });
      }}
      searchOptions={{
        componentRestrictions: { country: ['gb'] },
      }}
    >
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
        <div className="relative">
          <input
            {...getInputProps({
              placeholder: 'Search Places ...',
              className:
                'appearance-none text-13px text-dark dark:text-light w-full px-4 lg:px-5 py-2 h-11 md:h-12 xl:h-[50px] rounded bg-transparent border border-light-500 dark:border-dark-600 ring-[0.5px] ring-light-500 dark:ring-dark-600 focus:ring-[0.5px] focus:border-brand dark:focus:border-brand focus:ring-brand dark:focus:ring-brand',
            })}
          />
          <div className="absolute w-full bg-light shadow-lg dark:bg-dark-250">
            {loading && <div>Loading...</div>}
            {suggestions.map((suggestion) => {
              const className = suggestion.active
                ? 'py-2 px-4 text-dark dark:text-light bg-light-200 dark:bg-dark-200 cursor-pointer'
                : 'py-2 px-4 text-dark dark:text-light';

              return (
                <div
                  {...getSuggestionItemProps(suggestion, {
                    className,
                  })}
                >
                  <span>{suggestion.description}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </PlacesAutocomplete>
  );
}
