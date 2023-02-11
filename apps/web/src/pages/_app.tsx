import type { AppType } from "next/app";
import { api } from "~/libs/trpc/trpc";
import { AuthUserProvider } from "~/modules/auth/contexts";

const MyApp: AppType = ({ Component, pageProps }) => {
  return <AuthUserProvider><Component {...pageProps} /></AuthUserProvider>;
};

export default api.withTRPC(MyApp);
