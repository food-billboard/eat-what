declare namespace Upload {
  export interface IDeleteParams {
    _id: string;
  }

  export interface ILooadParams {
    load: string;
  }

  export interface UploadParams {
    file: File;
  }

  export type TAuthType = 'PRIVATE' | 'PUBLIC';

  export interface ICheckUploadFileParams {
    'Tus-Resumable': '1.0.0';
    md5: string;
    auth: TAuthType;
    size: number;
    mime: string;
    name?: string;
    chunk: number;
  }

  export interface ICheckUploadFileRes {
    'Tus-Resumable': '1.0.0';
    location: string;
    'Upload-Offset': number;
    'Upload-Length': number;
    'Upload-Id': string;
  }

  export interface UploadRes {
    _id: string;
    url: string;
  }

  export interface IUploadParams {
    md5: string;
    offset: number;
    file: Blob;
  }

  export interface IGetUploadParams {
    _id: string;
    type?: 0 | 1 | 2;
  }
}

declare namespace API_BASE {

  export type MenuType = 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'NIGHT_SNACK';

  export type GetEatMenuListParams = Partial<{
    content: string;
    date: string;
    menu_type: MenuType;
    currPage: number;
    pageSize: number;
  }>;

  export type GetEatMenuListData = {
    title: string;
    description: string;
    classify: string 
    classify_description: string 
    content: string;
    date: string;
    menu_type: MenuType;
    createdAt: string;
    updateAt: string;
    _id: string;
  };

  export type PostEatMenuData = Pick<
  GetEatMenuListData,
    'date' | 'description' | 'classify' | 'menu_type'
  >;

  export type PutEatMenuData = PostEatMenuData & {
    _id: string;
  };

  export type GetEatMenuClassifyListParams = Partial<{
    content: string;
    date: string;
    menu_type: MenuType;
    currPage: number;
    pageSize: number;
  }>;

  export type GetEatMenuClassifyListData = {
    title: string;
    description: string;
    content: string;
    date: string;
    menu_type: MenuType;
    createdAt: string;
    updateAt: string;
    _id: string;
  };

  export type GetRandomMenuParams = {
    breakfast: number 
    lunch: number 
    dinner: number 
    night_snack: number 
    ignore?: string 
  }

  export type GetRandomMenuData = {
    breakfast: GetEatMenuClassifyListData[]
    lunch: numGetEatMenuClassifyListData[]
    dinner: GetEatMenuClassifyListData[] 
    night_snack: GetEatMenuClassifyListData[] 
  }

}
