const { httpGet, httpPut, httpDelete, httpPost, acceptVerbs, route, nonRoutable } = require('../../expressController');

class Book {
    constructor(){ }
    details(){
        this.send({ received: true });
    }
    @httpPost
    @route('/global-path-book/:userId')
    foo(USERID, X, Y){
        this.send({ userId: USERID, x: X, y: Y });
    }
}

module.exports = Book;