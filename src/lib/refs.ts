// 手元の参照画像（refs/）の URL。dev サーバーのときだけ返し、build では undefined（公開サイトに画像を出さない）
export const refUrl = (game: string, path?: string) =>
  import.meta.env.DEV && path ? `/__refs/${game}/images/${path.split('/').map(encodeURIComponent).join('/')}` : undefined;
