import errorMessages from "../constants/errorMessages";
import respond from "../utils/respond";
import { request } from "../utils/request";
import { ImageKitOptions, UploadOptions, UploadResponse } from "../interfaces";

export const upload = (
  xhr: XMLHttpRequest,
  uploadOptions: UploadOptions,
  options: ImageKitOptions,
  callback?: (err: Error | null, response: UploadResponse | null) => void,
) => {
  if (!uploadOptions.file) {
    respond(true, errorMessages.MISSING_UPLOAD_FILE_PARAMETER, callback);
    return;
  }

  if (!uploadOptions.fileName) {
    respond(true, errorMessages.MISSING_UPLOAD_FILENAME_PARAMETER, callback);
    return;
  }

  if (!options.publicKey) {
    respond(true, errorMessages.MISSING_PUBLIC_KEY, callback);
    return;
  }

  if(!uploadOptions.token) {
    respond(true, errorMessages.MISSING_TOKEN, callback)
    return
  }

  if(!uploadOptions.signature) {
    respond(true, errorMessages.MISSING_SIGNATURE, callback)
    return
  }

  if(!uploadOptions.expire) {
    respond(true, errorMessages.MISSING_EXPIRE, callback)
    return
  }

  var formData = new FormData();
  let key: keyof typeof uploadOptions;
  for (key in uploadOptions) {
    if (key) {
      if (key === "file" && typeof uploadOptions.file != "string") {
        formData.append('file', uploadOptions.file, String(uploadOptions.fileName));
      } else if (key === "tags" && Array.isArray(uploadOptions.tags)) {
        formData.append('tags', uploadOptions.tags.join(",")); 
      } else if (key === 'signature') {
        formData.append("signature", uploadOptions.signature);
      } else if (key === 'expire') {
        formData.append("expire", String(uploadOptions.expire));
      } else if (key === 'token') {
        formData.append("token", uploadOptions.token);
      } else if (key === "responseFields" && Array.isArray(uploadOptions.responseFields)) {
        formData.append('responseFields', uploadOptions.responseFields.join(","));
      } else if (key === "extensions" && Array.isArray(uploadOptions.extensions)) {
        formData.append('extensions', JSON.stringify(uploadOptions.extensions));
      } else if (key === "customMetadata" && typeof uploadOptions.customMetadata === "object" &&
        !Array.isArray(uploadOptions.customMetadata) && uploadOptions.customMetadata !== null) {
        formData.append('customMetadata', JSON.stringify(uploadOptions.customMetadata));
      } else if(uploadOptions[key] !== undefined) {
        formData.append(key, String(uploadOptions[key]));
      }
    }
  }

  formData.append("publicKey", options.publicKey);

  request(xhr, formData, callback);
};
