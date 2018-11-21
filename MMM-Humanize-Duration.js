/* Magic Mirror Module: MMM-Humanize-Duration
 * Version: 1.0.0
 *
 * By Ricardo Gonzalez https://github.com/ryck/MMM-Humanize-Duration
 * MIT Licensed.
 */
Module.register("MMM-Humanize-Duration", {
	defaults: {
		updateInterval: 60 * 1 * 1000, // Every minute
		animationSpeed: 500,
		initialLoadDelay: 0, // start delay in milliseconds.
		options:  {
			round: true,
			units: ["y", "mo", "w", "d"],
			largest: 3,
			conjunction: " and ",
			serialComma: false
		 },
		debug: false
	},
	start: function() {
		var self = this;
		setInterval(function() {
			self.updateDom(); // no speed defined, so it updates instantly.
		}, this.config.updateInterval);
	},
	getStyles: function() {
		return ["MMM-Humanize-Duration.css"];
	},
	// Define required scripts.
	getScripts: function() {
		return ["moment.js", this.file("node_modules/humanize-duration/humanize-duration.js")];
	},
	//Define header for module.
	getHeader: function() {
		return this.data.header;
	},
	// Override dom generator.
	getDom: function() {
		var wrapper = document.createElement("div");
		if (!this.config.date) {
			wrapper.innerHTML = "Please set the date.";
			wrapper.className = "dimmed small";
			return wrapper;
		}
		wrapper.className = "small bold align-right"
		var start = moment(this.config.date);
		var diff =  moment().diff(start)
		var duration = humanizeDuration(diff, this.config.options)
		wrapper.innerHTML = duration;
		return wrapper;
	}
});
