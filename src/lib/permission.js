import permission from 'permission';
import response from "../api/concerns/response";

export default {
  role: 'userType',
  after: function(req, res, next, authorizedStatus){
    if(permission.NOT_AUTHORIZED === authorizedStatus) {
      response(res).unauthorized('Forbidden', 403);
    } else {
      next();
    }
  }
};