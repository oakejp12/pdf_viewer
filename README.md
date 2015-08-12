# pdf_viewer

## Versioning!

1. Make a folder of the specified version name in *server/uploads*
2. Change folder location inside multer middleware in *app.js*
  * `app.use(multer({...}))`
3. Upload files using *Document Listing* page located in the navigation bar in the application.
4. Change `fileNames` in `readDocuments()` in *routes/index.js*
5. Change `loadPdf()` in *views/index.jade* in `callback()` function.
6. Change version string sent to MongoDB in *routes/form.js*