# First Initialize git in the directory                     : git init
# git config Settings
- git config --global user.email "kidechadhanji@gmail.com"          (--global will save info globally in the system)
- git config --global user.name "dhanjiRajput"
# check git version                                         : git --version
# check Repo or git Status                                  : git status

## GitHub flow :-
=> git init (To Create Working Directory)  => git add . (To create Staging Area)  =>  git commit -m "updated"  (It will go to Git repo in locally)   =>  git push origin master (It will go to in git hub repo)


# which files, data and code are commited to repo that logs will dusplay        : git log
# logs will display in one line short info                                      : git log --oneline

# to ignore some file to push in repo                                           : Create global file .gitignore
# to push empty folder in repo                                                  : create .gitkeep in the empty folder 

# 3 Musketeers of Git
        1). Commit Object
            =>commit object contains the following info :
                - Tree Object
                - Parent Commit Object
                - Author
                - Commiter
                - Commit Message
        2). Tree Object
            =>Tree object contains the following info :
                - File Mode
                - File Name(Blob)
                - File Hash
                - Parent Tree Object
        3). Blob Object
            =>

# To see your current Branch                                                : git branch
# To only just create New Branch                                            : git branch new_branch_name
# To Shift new Created Branch                                               : git switch another_branch_name
                                                                            : git checkout new_branch mode
# To Create new Branch as well Shift to New Created New Branch together     : git switch -c new_branch_name
                                                                            : git checkout -b new-branch-name
# To Merge the Branch                                                       : git merge branch_name

# To see Difference