/**
 * Markdown / HTML 媒体资源地址处理
 * 保存前把富文本中的临时签 URL 替换为 cosKey
 */

/** 提取 md 中的图片标签 */
const mdImageUrlRegex = /!\[(.*?)\]\((.*?)\)/gm;

/** 提取图片标签中的 url */
const mdUrlRegex = /(!\[(.*?)]\()(.*?)(\))/;

/** HTML 媒体标签：img / video / audio */
const htmlMediaTagRegex = /<(img|video|audio)\b[^>]*>/gi;
/** Notion 附件锚点 */
const htmlFileAnchorRegex = /<a\b[^>]*data-type=["']file["'][^>]*>/gi;
const srcAttrRegex = /\bsrc=['"]?([^'"\s>]+)['"]?/i;
const hrefAttrRegex = /\bhref=['"]?([^'"\s>]+)['"]?/i;

type UrlPathInfo = {
  cosKey: string;
  type: 'cos' | 'server';
};

/**
 * 解析 url 路径得到对应的文件 key 或者 id
 * @param url 资源的地址
 */
const parseUrlPath = (url: string): UrlPathInfo => {
  if (url.startsWith('http')) {
    const urlObj = new URL(url);
    // 如果 pathname 包含 cloud-service，那么是自己的接口，fileId 在 params 里面
    if (url.indexOf('myqcloud.com') > -1) {
      // 如果不包含 cloud-service，那么是第三方的接口，那么 pathname 就是 coskey
      const cosKey = urlObj.pathname.replace(/^\//, '');
      return { cosKey, type: 'cos' };
    }
    return {
      cosKey: urlObj.searchParams.get('cosKey') || urlObj.searchParams.get('fileId') || '',
      type: 'server'
    };
  }
  return { cosKey: url, type: 'server' };
};

/**
 * 从 HTML 片段中收集媒体 URL（img/video/audio src + a[data-type=file] href）
 */
const collectHtmlMediaUrls = (html: string): string[] => {
  const urls: string[] = [];
  const pushFromMatch = (tag: string, attrReg: RegExp) => {
    const m = tag.match(attrReg);
    if (m?.[1]) {
      urls.push(m[1]);
    }
  };
  let match: RegExpExecArray | null;
  const mediaReg = new RegExp(htmlMediaTagRegex.source, 'gi');
  while ((match = mediaReg.exec(html)) !== null) {
    pushFromMatch(match[0], srcAttrRegex);
  }
  const fileReg = new RegExp(htmlFileAnchorRegex.source, 'gi');
  while ((match = fileReg.exec(html)) !== null) {
    pushFromMatch(match[0], hrefAttrRegex);
  }
  return urls;
};

/**
 * 将内容中出现的 oldUrl 全部替换为 newUrl（仅替换 URL 字符串本身）
 */
const replaceUrlInContent = (content: string, oldUrl: string, newUrl: string): string => {
  if (!oldUrl || oldUrl === newUrl) {
    return content;
  }
  return content.split(oldUrl).join(newUrl);
};

const getUrlFormMdImg = (urlTag: string): string => {
  if (!urlTag) {
    return '';
  }
  const urlObj = urlTag.match(mdUrlRegex);
  if (urlObj) {
    return urlObj[3];
  }
  return '';
};

/** 富文本的 url 替换规则 */
const defRrlVer = (src: string): boolean => {
  return src.includes('cloud-service/api/file/cross') || src.includes('myqcloud.com');
};

/**
 * 保存前：把 HTML 中的临时签 URL 换成 cosKey（含 img/video/audio/file 锚点）
 */
export const updateHtmlImgUrl = (html: string, urlVer: (url: string) => boolean = defRrlVer): string => {
  if (!html) return html;
  const urls = collectHtmlMediaUrls(html);
  for (const src of urls) {
    if (urlVer(src)) {
      const cosObj = parseUrlPath(src);
      if (cosObj.cosKey) {
        html = replaceUrlInContent(html, src, cosObj.cosKey);
      }
    }
  }
  return html;
};

/**
 * 保存前：Markdown 图片 + 嵌入的 Notion HTML 媒体 → cosKey
 */
export const updateMarkdownImgUrl = (
  markdown: string,
  urlVer: (url: string) => boolean = defRrlVer
): string => {
  if (!markdown) return markdown;
  const mdReg = new RegExp(mdImageUrlRegex.source, 'gm');
  const matches = [...markdown.matchAll(mdReg)];
  for (const match of matches) {
    const mdImg = match[0];
    const alt = match[1] || '';
    const imgUrl = match[2] || getUrlFormMdImg(mdImg);
    if (imgUrl && urlVer(imgUrl)) {
      const { cosKey } = parseUrlPath(imgUrl);
      if (cosKey) {
        markdown = markdown.replace(mdImg, `![${alt}](${cosKey})`);
      }
    }
  }
  // Notion 附件以 HTML 片段嵌在 Markdown 中
  return updateHtmlImgUrl(markdown, urlVer);
};
