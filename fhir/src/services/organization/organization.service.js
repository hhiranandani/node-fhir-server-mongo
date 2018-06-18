const { COLLECTION, CLIENT_DB } = require('../../constants');
const globals = require('../../globals');

/**
 * @name getCount
 * @description Get the number of organizations in our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.getCount = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Organization >>> getCount');
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.ORGANIZATION);
    // Query all documents in this collection
    collection.count((err, count) => {
        if (err) {
            logger.error('Error with Organization.getCount: ', err);
            return reject(err);
        }
        return resolve(count);
    });
});

/**
 * @name getOrganization
 * @description Get getOrganization(s) from our database
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.getOrganization = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Organization >>> getOrganization');
    reject(new Error('Support coming soon'));
});

/**
 * @name getOrganizationById
 * @description Get a organization by their unique identifier
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.getOrganizationById = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Organization >>> getOrganizationById');
    // Parse the required params, these are validated by sanitizeMiddleware in core
    let { id } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.ORGANIZATION);
    // Query our collection for this observation
    collection.findOne({ id: id.toString() }, (err, organization) => {
        if (err) {
            logger.error('Error with Organization.getOrganizationById: ', err);
            return reject(err);
        }
        resolve(organization);
    });
});

/**
 * @name createOrganization
 * @description Create a organization
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.createOrganization = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Organization >>> createOrganization');
    let { id, resource } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.ORGANIZATION);
    // If there is an id, use it, otherwise let mongo generate it
    let doc = Object.assign(resource.toJSON(), { _id: id });
    // Insert our organization record
    collection.insert(doc, (err, res) => {
        if (err) {
            logger.error('Error with Organization.createOrganization: ', err);
            return reject(err);
        }
        // Grab the organization record so we can pass back the id
        let [ organization ] = res.ops;

        return resolve({ id: organization.id });
    });
});

/**
 * @name updateOrganization
 * @description Update a organization
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.updateOrganization = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Organization >>> updateOrganization');
    let { id, resource } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.ORGANIZATION);
    // Set the id of the resource
    let doc = Object.assign(resource.toJSON(), { _id: id });
    // Insert/update our organization record
    collection.findOneAndUpdate({ id: id }, doc, { upsert: true }, (err, res) => {
        if (err) {
            logger.error('Error with Organization.updateOrganization: ', err);
            return reject(err);
        }
        // If we support versioning, which we do not at the moment,
        // we need to return a version
        return resolve({ id: res.value && res.value.id });
    });
});

/**
 * @name deleteOrganization
 * @description Delete a organization
 * @param {Object} args - Any provided args
 * @param {Winston} logger - Winston logger
 * @return {Promise}
 */
module.exports.deleteOrganization = (args, logger) => new Promise((resolve, reject) => {
    logger.info('Organization >>> deleteOrganization');
    let { id } = args;
    // Grab an instance of our DB and collection
    let db = globals.get(CLIENT_DB);
    let collection = db.collection(COLLECTION.ORGANIZATION);
    // Delete our organization record
    collection.remove({ id: id }, (err, _) => {
        if (err) {
            logger.error('Error with Organization.deleteOrganization');
            return reject({
                // Must be 405 (Method Not Allowed) or 409 (Conflict)
                // 405 if you do not want to allow the delete
                // 409 if you can't delete because of referential
                // integrity or some other reason
                code: 409,
                message: err.message
            });
        }
        return resolve();
    });
});