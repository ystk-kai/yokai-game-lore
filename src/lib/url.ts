/** base（/yokai-game-lore/）付きの内部リンクを作る */
export const url = (path = '') => `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`.replace(/([^/])$/, '$1/');
/** 静的ファイル（画像など）用。末尾にスラッシュを付けない */
export const file = (path: string) => `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
