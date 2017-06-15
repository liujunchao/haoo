 
export class FileDownService {
    constructor( ) {
    
    }
    static download(uriString:string){
        window["plugins"].imageDownloader.download(uriString,function(path){
            alert("下载成功，文件保存至"+path);
        },function(err){
            alert("下载失败，原因"+err);
        });
    }
}