export function PreviewImage(i, fileList) {

  const urls = fileList.map(item => item.url);

  wx.previewImage({
    current: urls[i], // 当前显示图片的http链接
    urls, // 需要预览的图片http链接列表
  })
}