import SecurePayPage from "./SecurePayPage";

export async function generateMetadata({ searchParams }) {
  const mosyTitle = "Transparency payment request";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `Transparency payment request`,
    description: 'The most secure way to make payment online',
    icons: {
      icon: `/logo.png`, // fix this too (see note below)
    },
  };
}

export default function Page() {
  return <SecurePayPage />;
}