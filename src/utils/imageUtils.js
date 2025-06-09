export const validateImage = (imageDataUrl) => {
  if (!imageDataUrl) {
    throw new Error('Image data is empty');
  }

  // Проверяем формат base64
  if (!imageDataUrl.startsWith('data:image')) {
    throw new Error('Invalid image format');
  }

  // Проверяем размер (максимум 20MB)
  const base64Length = imageDataUrl.length - (imageDataUrl.indexOf(',') + 1);
  const sizeInBytes = (base64Length * 3) / 4;
  const sizeInMB = sizeInBytes / (1024 * 1024);

  if (sizeInMB > 20) {
    throw new Error('Image size exceeds 20MB limit');
  }

  return true;
};

export const compressImage = async (imageDataUrl, maxSizeMB = 1) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      // Максимальное разрешение 2048px
      if (width > 2048 || height > 2048) {
        const ratio = Math.min(2048 / width, 2048 / height);
        width *= ratio;
        height *= ratio;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      // Сжимаем с качеством 0.8
      const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
      resolve(compressedDataUrl);
    };
    img.onerror = reject;
    img.src = imageDataUrl;
  });
}; 