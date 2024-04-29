export interface File {
    Key:          string;
    LastModified: Date;
    ETag:         string;
    Size:         number;
    StorageClass: string;
    Owner:        Owner;
}

export interface Owner {
    ID: string;
}
