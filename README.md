# codequatro
Just 4 coders coding

Closet Fashionista is a simple yes/no voting app for fashion and style.  Users can log in, upload a photo of an outfit, accessory or style and let their fellow users vote on how well that color, look, or vibe works for them.

Possible Future Features:
-------------------------
It can push to heroku with postgres as an addin db, but needs persistent data store for images
We started to connect to Amazon S3 account for that storage, could be finished
Allowing users to star favorites
Allow users to put up outfit choices (3 tops with a bottom) and get votes
Allow users to access your closet and build outfits for you - tell me what to wear


Technology Stack:
-----------------
Angular front-end
Node.js and Express server
Postgres for the Database
AWS-SDK -- amazons sdk for accessing s3 buckets


Git WorkFlow, Re-base style:
----------------------------
Master project file is maintained at the Org Level
Each dev forks the main repo to their github and
  then clones that copy to their local git
Add the master branch from the Org(CodeQuatro) as
  an upstream master for future pull --rebase commands
We had some difficulty with rebase in endless loops when there were conflicts

WorkFlow:
---------
-- starting new branch/feature --
git pull --rebase upstream master to get latest changes (as needed)

git checkout -b <intials-branch-name> to start new branch
git add and git commit early and often to your local branch
git push orign <initials-branch-name> to backup to github

-- prior to final push/pull request to org master --
git add and commit in your local branch
git pull --rebase upstream master to get latest changes to local master
resolve any conflicts => when in doubt, slack it out and ask others
git push orign <initials-branch-name> to your github
submit pull request to scrum master/maintainer of master repo
from your newly updated branch on your github

repeat as need with new branches/features

git pull --rebase upstream master can happen anytime you need to grab
  changes to the org master repo, or after the scrum master lets you know
  any changes have been merged into the master branch
