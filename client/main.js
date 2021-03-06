import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import './main.html';

Template.body.events({
	'click .find-publication'(event) {
		event.preventDefault();
		console.log('finding publications');
		var search_string = $('.publication_string').val();
		Meteor.parsePublications.searchPublications(search_string);
	},
	'keypress .publication_string': function (evt, template) {
		if (evt.which === 13) {
			console.log('finding publications');
			var search_string = $('.publication_string').val();
			Meteor.parsePublications.searchPublications(search_string);
			 
		}
	},
	'click .add-citations'(event) {
		event.preventDefault();
		console.log('adding citations');
		Meteor.call('addCitations');
	},
	'click .remove-citations'(event) {
		event.preventDefault();
		console.log('removing citations');
		Meteor.call('removeCitations');
	}, 
	'click .generate-dot-file'(event)  {
		event.preventDefault();
		console.log('generating dot file');
		Meteor.call('generateDotFile', function(err, dotFile){ 
			console.log('dot file returned');
			$('.dot-file').val(dotFile);
		});
	}, 
	'click .generate-cocitation-dot-file'(event)  {
		event.preventDefault();
		console.log('generating cocitation dot file');
		Meteor.call('generateCocitationDotFile', function(err, dotFile){ 
			console.log('dot file returned');
			$('.dot-file').val(dotFile);
		});
	},
	'click .logout': function(){
		console.log('logging out'); 
		Meteor.logout(function(){ 
			Modal.show('loginModal');
		});
	},
	'click .change-project': function(){
		Modal.show('projectsModal');
	}
});

Template.registerHelper(
	'cleanDate', function (val) {
		var date_obj  = new Date(val); 
		return  val.getFullYear();
	}
);

Template.publicationSearchResults.helpers({
	'searchResults': function (val) {
		var search_results =  new ReactiveVar( false );
		
		Meteor.subscribe('search_results', Session.get('current_project'));

		var search_pubs = Publications.find({search_result_project_ids: Session.get('current_project')});

		console.log(search_pubs);
		return  search_pubs;
	}
});

Template.publicationSearchResults.events({
  'click .remove-search-result': function () {
	event.preventDefault();
 
	Publications.update({_id : this._id}, {
		$pull:{search_result_project_ids:Session.get('current_project')}
	}); 
  },
  'click .add-search-result': function () {
	event.preventDefault();	
	Publications.update({_id : this._id}, {
		$pull:{search_result_project_ids:Session.get('current_project')},
		$addToSet:{corpus_project_ids:Session.get('current_project')}
	}); 

	Notifications.success('Added ' + this.title + ' results');
	var pub = Publications.findOne({_id : this._id});
	
	_.each(pub.author_ids, function(val,key) {
		Authors.update({_id: val}, {$addToSet:{author_project_ids:Session.get('current_project')}});
	});
  } 
});
 
Template.deletePublication.events({
  'click .delete-publication': function () {
	event.preventDefault();
	console.log('delete publication ' + this._id);
	Meteor.call('deletePublication', this._id);  	
  }
});

Template.currentProject.events({
  'click .change-project': function () {
	event.preventDefault();
	console.log('delete publication ' + this._id);
	Meteor.call('deletePublication', this._id);  	
  }
});

Template.currentProject.helpers({
	'currentProjectDoc': function (val) {
		
		var current_project_doc = Projects.find({_id: Session.get('current_project')});
	  	
		console.log('current_project_doc',current_project_doc.fetch());
		return current_project_doc;
	}
});


Template.body.onRendered(function () {
	if(!Meteor.userId()) {
		Modal.show('loginModal');
	} else { 
		
		if(Meteor.userId()) { 
			Meteor.subscribe('projects', Meteor.userId(), function() {
				var current_project = Projects.findOne({users: Meteor.userId()});
				Session.set("current_project", current_project._id);
			});
		}
	}
});

Accounts.onLogout(function() {
	Modal.show('loginModal');
});



Accounts.onLogin(function() {
	Modal.hide('loginModal');
	
	Meteor.subscribe('projects', function() {    
		var current_project = Projects.findOne({users: Meteor.userId()});
		Session.set("current_project", current_project._id);
  	});

});

Template.projectsModal.helpers({
	'projects': function (val) {
		var projects = Projects.find();
		
		return  projects; 
	}, 

	'is_current_project': function(id) { 
		if (id === Session.get("current_project")) { 
			return 'list-group-item-info';
		}
	}
});


Template.projectsModal.events({
	'click .new-project'(event) {
		event.preventDefault();
		console.log('Adding new project');
		var project_name = $('.new-project-text').val();
		Projects.insert({project_name: project_name, users:[Meteor.userId()]});
	},
	'click .list-group-item'(event) {
		event.preventDefault();

		Session.set("current_project", this._id);
		console.log('adding citations');
		Meteor.call('addCitations');
	},

	'click .rename'(event) {
		event.preventDefault();

		console.log('Renaming project');
		var new_name = $('.rename-text').val();
		Projects.update({_id: Session.get("current_project")},{$set:{project_name: new_name}});
	}
	
});

Template.body.helpers({
  pub_selector: function () {
    return {corpus_project_ids: Session.get("current_project")}; // this could be pulled from a Session var or something that is reactive
  }, 
  auth_selector: function(){
    return {author_project_ids: Session.get("current_project")}; // this could be pulled from a Session var or something that is reactive


  }
});

Meteor.startup(function () {
    _.extend(Notifications.defaultOptions, {
        timeout: 3000
    });
});



