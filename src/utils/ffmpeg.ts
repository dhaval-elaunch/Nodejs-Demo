import ffmpeg from 'fluent-ffmpeg';
import path from 'path';

export const generateThumbnail = (videoPath: string, thumbnailPath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .on('end', () => resolve(thumbnailPath))
      .on('error', (err: any) => reject(err))
      .screenshots({
        count: 1,
        folder: path.dirname(thumbnailPath),
        filename: path.basename(thumbnailPath),
        size: '320x240',
      });
  });
};
