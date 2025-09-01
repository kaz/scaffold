import { Code, ConnectError } from "@connectrpc/connect";
import { TransportProvider } from "@connectrpc/connect-query";
import { createConnectTransport } from "@connectrpc/connect-web";
import { QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
	queryCache: new QueryCache(),
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			staleTime: 5 * 60 * 1000,
			retry(failureCount, error) {
				if (error instanceof ConnectError) {
					if (error.code === Code.NotFound) {
						return false;
					}
				}
				return failureCount < 3;
			},
		},
	},
});

export default function ({ children }: { children: React.ReactNode }) {
	return (
		<TransportProvider
			transport={createConnectTransport({
				baseUrl: "/",
				useHttpGet: true,
				useBinaryFormat: import.meta.env.PROD,
			})}
		>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</TransportProvider>
	);
}
