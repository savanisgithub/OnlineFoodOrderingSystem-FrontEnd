const BACKEND_ORIGIN = "http://localhost:8081";

export function getBackendImageUrl(imageUrl?: string) {
    if (!imageUrl) {
        return "";
    }

    if (/^https?:\/\//i.test(imageUrl)) {
        return imageUrl;
    }

    return `${BACKEND_ORIGIN}${imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`}`;
}
