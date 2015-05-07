define(['app'], function(App) {

	var FileUploader = {};

	// Upload URL
	FileUploader.uploadURL = App.request('setting', 'RootURL') + '/upload';

	//
	// Upload Files
	// --------------------------------------------------
	// Returns a jQuery Promise object and resolves bound
	// Deferred only when all files have finished uploading
	// successfuly or otherwise.
	//
	// The Deferred is resolved with an array containing
	// the final URLs of the files uploaded (provided by
	// the server as a response to each successful upload)
	//
	FileUploader.uploadFiles = function(fileArray) {
		var deferred = $.Deferred();
		var fileSum = fileArray.length;
		var successCount = 0;
		var errorCount = 0;
		var filePaths = [];
		for (var i = 0, f; f = fileArray[i]; i++) {
			/*jshint loopfunc:true */
			var formData = new FormData();
			formData.append('file', f);
			formData.append('folder', 'files');
			var uploading = $.ajax({
				url: FileUploader.uploadURL,
				type: 'POST',
				// Form data
				data: formData,
				// Options to tell jQuery not to process data or worry about content-type.
				cache: false,
				contentType: false,
				processData: false
			});
			uploading.done(function(response) {
				filePaths.push(response.filename);
				successCount++;
			});
			uploading.fail(function() {
				errorCount++;
			});
			uploading.always(function() {
				if (successCount + errorCount === fileSum) {
					deferred.resolve(filePaths);
				}
			});
		}
		if (fileSum === 0) {
			deferred.resolve([]);
		}
		return deferred.promise();
	};

	return FileUploader;
});