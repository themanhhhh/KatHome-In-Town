import axios from 'axios';
import FormData from 'form-data';

export class PinataService {
  private static readonly PINATA_API_KEY = '5b9afb41a6a64bcad1f7';
  private static readonly PINATA_SECRET_KEY = '080a3e13f1c8a9527e3ff8faaeb9871b5df53900099d88edba2259f98be701ec';
  private static readonly PINATA_UPLOAD_URL = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
  private static readonly PINATA_GATEWAY_URL = 'https://gateway.pinata.cloud/ipfs';

  /**
   * Upload file to Pinata IPFS
   * @param file - File buffer or stream
   * @param fileName - Name of the file
   * @param metadata - Optional metadata for the file
   * @returns Promise<string> - IPFS hash URL
   */
  static async uploadFile(
    file: Buffer | NodeJS.ReadableStream,
    fileName: string,
    metadata?: {
      name?: string;
      keyvalues?: Record<string, string>;
    }
  ): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', file, fileName);

      // Add metadata if provided
      if (metadata) {
        formData.append('pinataMetadata', JSON.stringify({
          name: metadata.name || fileName,
          keyvalues: metadata.keyvalues || {}
        }));
      }

      const response = await axios({
        method: 'post',
        url: this.PINATA_UPLOAD_URL,
        data: formData,
        headers: {
          pinata_api_key: this.PINATA_API_KEY,
          pinata_secret_api_key: this.PINATA_SECRET_KEY,
          ...formData.getHeaders(),
        },
      });

      const ipfsHash = response.data.IpfsHash;
      const imageUrl = `${this.PINATA_GATEWAY_URL}/${ipfsHash}`;
      
      console.log(`File successfully uploaded to Pinata: ${imageUrl}`);
      return imageUrl;
    } catch (error) {
      console.error('Pinata upload error:', error.response?.data || error.message);
      throw new Error(`Unable to upload file to Pinata: ${error.message}`);
    }
  }

  /**
   * Upload image file with specific entity context
   * @param file - File buffer
   * @param fileName - Name of the file
   * @param entityType - Type of entity (user, phong, hangphong, etc.)
   * @param entityId - ID of the entity
   * @returns Promise<string> - IPFS hash URL
   */
  static async uploadImageForEntity(
    file: Buffer,
    fileName: string,
    entityType: string,
    entityId: string
  ): Promise<string> {
    const metadata = {
      name: `${entityType}_${entityId}_${fileName}`,
      keyvalues: {
        entityType,
        entityId,
        uploadDate: new Date().toISOString()
      }
    };

    return this.uploadFile(file, fileName, metadata);
  }

  /**
   * Delete file from Pinata (if needed in the future)
   * Note: Pinata doesn't support direct deletion, files are permanent on IPFS
   * This method is here for future reference
   */
  static async deleteFile(ipfsHash: string): Promise<void> {
    console.warn('Pinata/IPFS files cannot be deleted once uploaded. They are permanent.');
    throw new Error('IPFS files are permanent and cannot be deleted');
  }
}
