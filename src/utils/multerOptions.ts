import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';

export const multerOptions = {
  storage: diskStorage({
    destination: './uploads/games/',
  }),
  fileFilter: (req, file, callback) => {
    if (
      file.originalname.toLowerCase().endsWith('.js') &&
      file.mimetype === 'application/javascript'
    ) {
      callback(null, true);
    } else {
      callback(
        new BadRequestException('Only javascript files are allowed'),
        false,
      );
    }
  },
};
