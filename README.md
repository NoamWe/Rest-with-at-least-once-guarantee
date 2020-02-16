## Rest-with-at-least-once-guarantee

#### Challenge Definition

I wanted to Write a node.js app that accepts some data on a REST interface, saves it to a relational database and after the save completed successfully makes a call to any other external API. 
The challenge is to have “at least once” behavior on calling the external API i.e. if the save completed successfully and the service crashed before making the call, I want to make sure I do the call when the service restarts.

#### Requirements
* Redis 
* Clone and do npm install
* run node app.js