import { getRequestConfig } from 'next-intl/server';
import { cookies } from "next/headers";

export default getRequestConfig(async () => {

  const cookiesStore = cookies()
  const locale = cookiesStore.get('locale')?.value || 'es';
 
  return {
    locale,
    messages: (await import(`../../public/messages/${locale}.json`)).default

  };
});