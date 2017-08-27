export interface MetadataStorageOptions {}

export class MetadataStorage {
  private __destroy__(): Promise;
  private __read__(): Promise<string>;
  private __write__(json: string): Promise;

  public constructor(options?: MetadataStorageOptions = {});

  public ensure(): Promise;
  public destroy(): Promise;
  public read(): Promise<string>;
  public write(json: string): Promise;
}
