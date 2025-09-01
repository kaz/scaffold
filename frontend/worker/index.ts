export default {
	fetch(request, env) {
		const isAPIPath = new RegExp("^/trade\\.v1\\.TradeService/");

		const url = new URL(request.url);
		if (isAPIPath.test(url.pathname)) {
			const req = new Request(new URL(`${url.pathname}${url.search}`, env.BACKEND_URL), request);
			return fetch(req);
		}

		return new Response(null, { status: 404 });
	},
} satisfies ExportedHandler<Env>;
