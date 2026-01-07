// repositories/core.repository.js

module.exports = function coreRepository(model) {
  return {
    findAll: (filter = {}, projection = null, options = {}) =>
      model.find(filter, projection, options),

    findById: (id) => model.findById(id),

    findOne: (filter = {}) => model.findOne(filter),

    create: (data) => model.create(data),

    updateById: (id, data, options = { new: true }) =>
      model.findByIdAndUpdate(id, data, options),

    deleteById: (id) => model.findByIdAndDelete(id),

    exists: (filter = {}) => model.exists(filter),
  };
};
