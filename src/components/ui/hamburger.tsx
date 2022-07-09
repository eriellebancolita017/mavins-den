import Button from '@/components/ui/button';

interface HamburgerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isToggle?: boolean;
}

export default function Hamburger({ isToggle, ...props }: HamburgerProps) {
  return (
    <Button variant="icon" aria-label="Hamburger" {...props}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        className="h-6 w-6"
      >
        <path
          className="transition-all duration-200"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d={isToggle ? 'M4 6h16M4 12h8m-8 6h16' : 'M4 6h16M4 12h16M4 18h16'}
        />
      </svg>
    </Button>
  );
}
