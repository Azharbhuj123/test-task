import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { ragService } from './rag.service';

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'text/plain' || file.originalname.endsWith('.md') || file.originalname.endsWith('.txt')) {
      cb(null, true);
    } else {
      cb(new Error('Only .md and .txt files are allowed'));
    }
  }
});

export const listDocuments = (_req: Request, res: Response) => {
  const docs = ragService.listDocuments();
  res.json({ success: true, data: docs });
};

export const uploadDocument = [
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        res.status(400).json({ success: false, error: 'No file uploaded' });
        return;
      }
      const content = req.file.buffer.toString('utf8');
      const filename = req.file.originalname;
      ragService.saveDocument(filename, content);
      res.json({
        success: true,
        data: { name: filename, size: req.file.size },
        message: `Document "${filename}" uploaded successfully`
      });
    } catch (e: any) {
      next(e);
    }
  }
];

export const deleteDocument = (req: Request, res: Response) => {
  const { name } = req.params;
  ragService.deleteDocument(name);
  res.json({ success: true, message: `Document "${name}" deleted` });
};
