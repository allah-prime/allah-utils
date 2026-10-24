export const fileUtils = {
  /**
   * 判断是否为图片文件
   * @param filename 文件名
   * @returns 是否为图片文件
   */
  isImageFile(filename: string): boolean {
    const rgx = '(JPEG|jpeg|JPG|jpg|gif|GIF|HEIC|heic|BMP|bmp|PNG|png)$';
    const re = new RegExp(rgx, 'i');
    const fileExt = filename.replace(/.+\./, '');
    return re.test(fileExt);
  }
};

export default fileUtils;
/** 文档类文件后缀 */
export const docSuffix: string[] = ['doc', 'docx', 'dot', 'dotx', 'docm', 'dotm', 'rtf'];

/** PDF 文件后缀 */
export const pdfSuffix: string[] = ['pdf', 'PDF', 'Pdf'];

/** 表格类文件后缀 */
export const exclSuffix: string[] = ['xlsx', 'xls'];

export * from './fileUpload2Usage';
export { default as fileUpload2Usage } from './fileUpload2Usage';
export * from './markdownMedia';
