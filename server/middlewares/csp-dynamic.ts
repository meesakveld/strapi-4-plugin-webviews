function getDomainVariants(domain: string): string[] {
    const url = new URL(domain);
    const host = url.hostname;
    const protocol = url.protocol;

    const variants = new Set<string>();
    variants.add(`${protocol}//${host}`);

    const parts = host.split('.');

    if (parts.length > 2 && parts[0] !== 'www') {
        const wwwHost = ['www', ...parts.slice(1)].join('.');
        variants.add(`${protocol}//${wwwHost}`);
    }

    if (parts.length === 2) {
        variants.add(`${protocol}//www.${host}`);
    }

    return Array.from(variants);
}

const cspDynamic = async (ctx, next) => {
    await next();

    const webviews = await strapi.entityService?.findMany('plugin::webviews.webview', {
        limit: -1,
        fields: ['url'],
    });

    const domains = (webviews ?? [])
        .map(w => {
            try {
                return new URL(w.url).origin;
            } catch {
                return null;
            }
        })
        .filter((d): d is string => Boolean(d));

    const uniqueDomains = Array.from(
        new Set(domains.flatMap(getDomainVariants))
    );

    const dynamicSrc = uniqueDomains.join(' ');

    let csp = ctx.response.headers['content-security-policy'];

    if (typeof csp === 'string') {
        csp = csp.includes('frame-src')
            ? csp.replace(/frame-src[^;]*/, `frame-src 'self' ${dynamicSrc}`)
            : `${csp}; frame-src 'self' ${dynamicSrc}`;

        ctx.set('Content-Security-Policy', csp);
    }
};

export default cspDynamic;
