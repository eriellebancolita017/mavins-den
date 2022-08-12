export const PackageIcon: React.FC<React.SVGAttributes<{}>> = (props) => {
  return (
    <svg
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.279 0.429L9 0.317L8.721 0.429L1.221 3.429L0.75 3.617V4.125V13.875V14.383L1.221 14.571L8.721 17.571L9 17.683L9.279 17.571L16.779 14.571L17.25 14.383V13.875V4.125V3.617L16.779 3.429L9.279 0.429ZM2.25 5.233V13.367L8.25 15.767V7.633L2.25 5.233ZM9.75 7.633V15.767L15.75 13.367V5.233L9.75 7.633ZM14.481 4.125L9 1.933L7.457 2.55L12.938 4.742L14.481 4.125ZM3.519 4.125L5.438 3.358L10.918 5.55L9 6.317L3.519 4.125Z"
        fill="currentColor"
      />
    </svg>
  );
};
