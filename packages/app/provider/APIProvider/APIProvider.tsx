import Config from "app/config";
import { storageKeys } from "app/constants";
import SafeStorage from "app/utils/safe-storage";
import { trpc } from "app/utils/trpc";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

const createTrpcClient = () => {
  return trpc.createClient({
    url: Config.apiUrl,
    async headers() {
      const sessionToken = await SafeStorage.get(storageKeys.sessionToken);

      return {
        authorization: sessionToken ? `Bearer ${sessionToken}` : undefined,
        "Content-Type": "application/json",
        Accept: "application/json",
      };
    },
  });
};

// Provider
export const APIProvider = ({ children }: React.ComponentProps<any>) => {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() => createTrpcClient());

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
};
