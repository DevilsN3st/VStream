It is used as a repo cleaner. It removes unwanted files which have been committed to a git repo.

Usage

you should make a backup of it to ensure you don't lose anything.

Now you can run the BFG to clean your repository up:

Examples
In all these examples bfg is an alias for java -jar bfg.jar.

Delete all files named 'id_rsa' or 'id_dsa' :

$ bfg --delete-files id_{dsa,rsa}  my-repo.git
Remove all blobs bigger than 50 megabytes :

$ bfg --strip-blobs-bigger-than 50M  my-repo.git
Replace all passwords listed in a file (prefix lines 'regex:' or 'glob:' if required) with ***REMOVED*** wherever they occur in your repository :

$ bfg --replace-text passwords.txt  my-repo.git
Remove all folders or files named '.git' - a reserved filename in Git. These often become a problem when migrating to Git from other source-control systems like Mercurial :

$ bfg --delete-folders .git --delete-files .git  --no-blob-protection  my-repo.git
For further command-line options, you can run the BFG without any arguments, which will output text like this.