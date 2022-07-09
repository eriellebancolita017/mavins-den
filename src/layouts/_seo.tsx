import { NextSeo, NextSeoProps } from 'next-seo';
interface SeoProps extends NextSeoProps {
  url: string;
}
const Seo = ({ title, description, url, ...props }: SeoProps) => {
  return (
    <NextSeo
      title={title}
      description={description}
      openGraph={{
        url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/${url}`,
        title,
        description,
      }}
      {...props}
    />
  );
};

export default Seo;
