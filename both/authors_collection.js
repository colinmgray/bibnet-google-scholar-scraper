Authors = new Mongo.Collection('authors');

AuthorsSchema = new SimpleSchema({
 "name": {
    type: String,
    label: "name"
  },
  "google_author_id": {
    type: String,
    label: "Google author id",
    optional:true,
  },
  "tags": {
    type: [String],
    label: "target",
    optional:true,    
  },
  "institution": {
    type: String,
    label: "target",
    optional:true,    
  },
  "author_project_ids": {
    type: [String],
    label: "target",
    optional:true,    
  }
});

Authors.attachSchema( AuthorsSchema ); 

Authors.allow({
    update: function(userId, doc) {
       if(userId){
          return true
       }
    }
})