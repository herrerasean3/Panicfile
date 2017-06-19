# PanicFile

## About PanicFile

### *"When you have to change your project three days before it's due, it's time for Panic."*

Panicfile was built in exactly that, panic. Built in three days, PanicFile is a handy 20MB limit filesharing site for hosting documents, music, videos, and pictures.

## Using PanicFile

PanicFile is easy as pie to use!

### Uploading a File:
Just hit the Choose File button, pick a category, and hit Upload File! There's a function in place to refresh the page when the upload is finished, but the database may not have immediately updated, thereby not showing your file. If this happens, just refresh the page.

### Searching Files:
Use the search bar to enter a search term and hit submit to run a search for files containing your search term, regardless of category. Select a category as well for a more refined search, or alternatively, use only a category to search for all files in a given category.

### Deleting Files:
File deletion is a little bugged, so bear with me.

Click the red X in the delete file column for your file of choice. Due to issues with how node js handles the file system, this will cause the page to load and may return an error. Have no fear, as you may refresh the page in the middle of this process, or return to the homepage when the error is returned, and your file will have been successfully deleted.

## Technologies Used

* NodeJS
* Express
* pg-promise
* multer
* JQuery
* Postgres

## Resources Used:

* [Trenchthin font by Pixel Sagas](http://www.fontspace.com/nimavisual/trench)
