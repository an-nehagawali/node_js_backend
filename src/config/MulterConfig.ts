import multer from 'multer';
import path from 'path';

class MulterConfig {
  private static storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const basename = path.basename(file.originalname, ext);
      cb(null, `${basename}-${Date.now()}${ext}`);
    },
  });

  public static getUploadMiddleware() {
    return multer({
      storage: this.storage,
      limits: { fileSize: 2 * 1024 * 1024 }, // Limit file size to 2MB
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (allowedMimeTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error('Invalid file type. Only JPEG, PNG, and GIF files are allowed.'));
        }
      },
    });
  }
}

export default MulterConfig;
