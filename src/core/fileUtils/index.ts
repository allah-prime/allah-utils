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