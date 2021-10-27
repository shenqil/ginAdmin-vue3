import * as tus from "tus-js-client";
/**
 * 上传一个文件
 * */ 
export default function(file:File,callBack:Function|undefined){
    return new Promise((resolve,reject)=>{
        // Create a new tus upload
        var upload = new tus.Upload(file, {
            endpoint: `${window.location.origin}/files/files/`,
            retryDelays: [0, 3000, 5000, 10000, 20000],
            metadata: {
                filename: file.name,
                filetype: file.type
            },
            onError: function(error) {
                reject(error)
            },
            onProgress: function(bytesUploaded, bytesTotal) {
                var percentage = (bytesUploaded / bytesTotal * 100).toFixed(2)
                callBack&&callBack(percentage)
            },
            onSuccess: function() {
                resolve(upload.url?.split('/files/files/')[1])
            }
        })

        // Check if there are any previous uploads to continue.
        upload.findPreviousUploads().then(function (previousUploads) {
            // Found previous uploads so we select the first one. 
            if (previousUploads.length) {
                upload.resumeFromPreviousUpload(previousUploads[0])
            }

            // Start the upload
            upload.start()
        })
    })
}
