const UTM = "?utm_source=pic_palette&utm_medium=referral";

export const photographerProfileUrl = (userName: string) => `https://unsplash.com/@${userName}${UTM}`;

export const photoPageUrl = (photoUrl: string) => `${photoUrl}${UTM}`;
