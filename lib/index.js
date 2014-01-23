module.exports = {
	namespace: "post",
	units: require('./resources/units'),
	scheme: {
		"posts": {
			indexes: ["slug"]
		}
	}
};
