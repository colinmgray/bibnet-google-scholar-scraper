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
  "is_first_level": { 
    type: Boolean,
    label: 'Is First Level?', 
    defaultValue: false
  }
});

Authors.attachSchema( AuthorsSchema ); 