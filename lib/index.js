module.exports = {
	units: require('./resources/units'),
	name: "post",
	scheme: {
		"posts": {
			indexes: ["slug"]
		}
	}
};
