const supabaseRemotePattern = process.env.NEXT_PUBLIC_SUPABASE_URL
	? (() => {
			const url = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL);

			return {
				protocol: url.protocol.replace(':', ''),
				hostname: url.hostname,
				pathname: '/storage/v1/object/public/**',
			};
		})()
	: null;

/** @type {import('next').NextConfig} */
const nextConfig = {
	allowedDevOrigins: ['localhost', '127.0.0.1'],
	images: {
		remotePatterns: supabaseRemotePattern ? [supabaseRemotePattern] : [],
	},
};

export default nextConfig;
