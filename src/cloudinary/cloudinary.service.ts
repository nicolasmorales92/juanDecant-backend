import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  constructor(private readonly configService: ConfigService) {
  
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUD_KEY'),
      api_secret: this.configService.get<string>('CLOUD_SECRET'),
    });
  }
  
  async subirImagen(file: Express.Multer.File): Promise<string> {
    if (!file) {
      throw new BadRequestException('No se ha proporcionado ninguna imagen');
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'perfumes_juanchi',
          allowed_formats: ['jpg', 'jpeg', 'png', 'webp'], 
        },
        (error, resultado) => {
          if (error) {
            return reject(new BadRequestException(`Error al subir a Cloudinary: ${error.message}`));
          }
          if(resultado)
          resolve(resultado.secure_url);
        }
      );

      const stream = new Readable();
      stream.push(file.buffer); 
      stream.push(null); 
      stream.pipe(uploadStream);
    });
  }
}