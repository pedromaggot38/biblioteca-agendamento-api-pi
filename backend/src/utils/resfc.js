import _ from 'lodash';

export const resfc = ({ res, code, data = null, message = null, results = null }) => {
  const resBody = {
    status: code < 400 ? 'success' : 'error',
  };

  if (message) resBody.message = message;
  if (results !== null) resBody.results = results;

  if (data && typeof data === 'object') {
    const sanitizedData = _.cloneDeep(data);
    
    const omitPassword = (obj) => {
      if (_.isObject(obj)) {
        if ('password' in obj) delete obj.password;
        _.forOwn(obj, (v) => omitPassword(v));
      }
    };

    omitPassword(sanitizedData);
    resBody.data = sanitizedData;
  }

  return res.status(code).json(resBody);
};