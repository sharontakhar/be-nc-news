BE-NC-NEWS

Hi all, welcome to my repo!

I be building an API for the purpose of accessing application data programmatically.
My intention here is to mimic the building of a real world backend service (such as reddit, quora, YOU KNOW THE SCORE!) which should provide this information to the front end architecture.

Connect Locally
You can either fork this repo and then make your own clone of this repository and run the command npm i to get started.

Enviroment Variables Files
please remember to create your environment files as per the below and ensure these are ignored and mentioned in .gitignore by using ".env.\*"

.env.development
.env.test

In each file please add `PGDATABASE=<database_name_here>`, with the correct database name for that environment (see `/db/setup.sql` for the database names).
