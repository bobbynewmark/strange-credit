var app = {
    apiKey : "NAZCWIKKFKOWDGVQKEKX",
    pages: [],
    notFound : { header: "Not found", body: "You reqested a page that wasn't there" },
    defaultPage : { footer:"Hoist rules" },
    startHere : function() {
	Hoist.apiKey(this.apiKey);
	if (window.location.pathname==="/edit.html") {
	    Hoist.status(
		function() {
		    console.log("Editing...");
		    $("#edit_pane").show();
		    $("#login_pane").hide();
		    $("#edit_load").click(app.editLoad);
		    $("#edit_submit").click(app.editSubmit);
		},
		function() {
		    console.log("Login...");
		    $("#edit_pane").hide();
		    $("#login_pane").show();
		    $("#edit_login").click(app.editLogin);		    
		}
	    );
	}
	else {
	    Hoist("page").get(function(data) { app.cache(data, app.route); });
	    window.onhashchange = app.route;
	    }
    },
    editLogin: function() {
	Hoist.login(
	    {email:$("#edit_email").val(), password:$("#edit_password").val()},
	    function() { window.location= "/edit.html"; }
	    );
    },
    editLoad:  function() {
	Hoist.get("page", $("#page_name").val(),
		  function(data) {
		      $("#title").val(data.header);
		      $("#body").val(data.body);
		  });
    },
    editSubmit: function() {
	Hoist.post("page", { header: $("#title").val(),
			     body:$("#body").val(),
			     _id: $("#page_name").val()
			   }, app.editComplete);	
    },
    editComplete: function() {
	alert("Saved");
    },
    cache: function(data, callback) {
	app.pages = _.each(data, function(page) { _.defaults(page, app.defaultPage); });
	callback();
    },
    route: function() {
	var hash = window.location.hash.slice(1);
	hash = hash || "index";
	var view = _.find(app.pages, function(item) { return item._id === hash; });
	view = view || app.notFound;
	console.log(hash, view);
	app.renderTemplate("body_template", view);
    },
    renderTemplate: function(templateName, view) {
	view = view || {};
	var template = $("#" + templateName).text();
        var templateHTML = Mustache.render(template, view);
	$("#data-main").html(templateHTML);
    }
};

$(function() { app.startHere(); });
