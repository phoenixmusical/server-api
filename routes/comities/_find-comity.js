var Comity = require('../../models/comity');

module.exports = function(req){
    return Comity.findById(req.params.comity)
		.exec()
		.then(function(comity){
			if(!comity){
				throw new Error("Comity not found");
			}
			return comity
		})
};