import { apiPattern } from "./api";

const apiRegExp = new RegExp(apiPattern);

export default {
	fetch(request, env) {
		const url = new URL(request.url);
		if (apiRegExp.test(url.pathname)) {
			const req = new Request(new URL(`${url.pathname}${url.search}`, env.BACKEND_URL), request);
			return fetch(req);
		}

		return new Response(null, { status: 404 });
	},
} satisfies ExportedHandler<Env>;
