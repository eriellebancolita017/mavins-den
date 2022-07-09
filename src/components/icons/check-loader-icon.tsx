export const CheckLoaderIcon: React.FC<React.SVGAttributes<{}>> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 37 37"
      {...props}
    >
      <path
        // class="circ path"
        stroke="#000"
        strokeWidth="3"
        strokeLinejoin="round"
        strokeMiterlimit="10"
        d="
	M30.5,6.5L30.5,6.5c6.6,6.6,6.6,17.4,0,24l0,0c-6.6,6.6-17.4,6.6-24,0l0,0c-6.6-6.6-6.6-17.4,0-24l0,0C13.1-0.2,23.9-0.2,30.5,6.5z"
      />
      <polyline
        // class="tick path"
        stroke="#000"
        strokeWidth="3"
        strokeLinejoin="round"
        strokeMiterlimit="10"
        points="
	11.6,20 15.9,24.2 26.4,13.8 "
      />
    </svg>
  );
};
