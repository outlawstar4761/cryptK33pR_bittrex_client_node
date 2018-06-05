var self = this;
self.https = require('https');
self.queryStr = require('querystring');
self.crypto = require('crypto');
self.hostName = 'bittrex.com';
self.port = '443';
self.apiBase = 'https://bittrex.com/api/v1.1/';
self.apiKey = '1234';
self.privateKey = '1234';
self.publicMethods = [
    'getMarkets',
    'getcurrencies',
    'getticker',
    'getmarketsummaries',
    'getmarketsummary',
    'getorderbook',
    'getmarkethistory'
];
self.privateMethods = [
    'getbalances',
    'getbalance',
    'getdepositaddress',
    'withdraw',
    'getorder',
    'getorderhistory',
    'getwithdrawalhistory',
    'getdeposithistory'
];
self.marketMethods = [
    'buylimit',
    'selllimit',
    'cancel',
    'getopenorders'
];
self.getUrl = function(url){
    return new Promise(function(resolve,reject){
        self.https.get(url,function(response){
            let data = '';
            response.on('data',function(chunk){
                data += chunk;
            });
            response.on('end',function(){
                resolve(JSON.parse(data));
            });
        }).on('error',function(err){
            reject(err.message);
        });
    });
}
self.apiCall = function(method,params){
    var options = {
        hostname:self.hostName,
        port:self.port,
        headers:{
            'Content-Type':'application/json; charset=utf-8'
        }
    };
    var uri = self.apiBase;
    if(self.publicMethods.indexOf(method) > -1){
        uri += 'public/' + method + '?' + self.queryStr.stringify(params);
    }else if(self.privateMethods.indexOf(method) > -1){
        uri += 'account/' + method + '?' + self.queryStr.stringify(params);
        options.headers.apisign = self.buildSignature(uri);
    }else if(self.marketMethods.indexOf(method) > -1){
        uri += 'market/' + method + '?' + self.queryStr.stringify(params);
        options.headers.apisign = self.buildSignature(uri);
    }else{
        throw new Error('Invalid API Method');
    }
    options.path = uri;
    return new Promise(function(resolve,reject){
        self.getUrl(options).then(function(data){
            resolve(data);
        },function(err){
            reject(err);
        });
    });
}
self.buildSignature = function(uri){
    return self.crypto.createHmac('sha512',self.privateKey).update(uri).digest('hex');
}
self.getMarkets = function(){
    return new Promise(function(resolve, reject){
        self.apiCall("getMarkets").then(function(data){
            resolve(data.result);
        },function(err){
            reject(err);
        });
    });
}
self.getCurrencies = function(){
    return new Promise(function(resolve, reject){
        self.apiCall("getcurrencies").then(function(data){
            resolve(data.result);
        },function(err){
            reject(err);
        });
    });
}
self.getTicker = function(){
    return new Promise(function(resolve, reject){
        self.apiCall("getticker").then(function(data){
            resolve(data.result);
        },function(err){
            reject(err);
        });
    });
}
self.getMarketSummaries = function(){
    return new Promise(function(resolve, reject){
        self.apiCall("getmarketsummaries").then(function(data){
            resolve(data.result);
        },function(err){
            reject(err);
        });
    });
}
self.getMarketSummary = function(market){
    return new Promise(function(resolve, reject){
        self.apiCall("getmarketsummary",{market:market}).then(function(data){
            resolve(data.result);
        },function(err){
            reject(err);
        });
    });
}
self.getOrderBook = function(market,type){
    return new Promise(function(resolve, reject){
        self.apiCall("getorderbook",{market:market,type:type}).then(function(data){
            resolve(data.result);
        },function(err){
            reject(err);
        });
    });
}
self.getMarketHistory = function(market){
    return new Promise(function(resolve,reject){
        self.apiCall("getmarkethistory",{market:market}).then(function(data){
            resolve(data.result);
        },function(err){
            reject(err);
        });
    });
}
self.getBalances = function(){
    return new Promise(function(resolve, reject){
        self.apiCall("getbalances",{apikey:self.apiKey,nonce:Math.floor(new Date().getTime() * 1000)}).then(function(data){
            console.log(data);
            resolve(data.result);
        },function(err){
            reject(err);
        });
    });
}
self.getBalance = function(currency){
    return new Promise(function(resolve, reject){
        self.apiCall("getbalance",{apikey:self.apiKey,nonce:Math.floor(new Date().getTime() * 1000),currency:currency}).then(function(data){
            resolve(data.result);
        },function(err){
            reject(err);
        });
    });
}
self.getDepositAddress = function(currency){
    return new Promise(function(resolve, reject){
        self.apiCall("getdepositaddress",{apikey:self.apiKey,nonce:Math.floor(new Date().getTime() * 1000),currency:currency}).then(function(data){
            resolve(data.result);
        },function(err){
            reject(err);
        });
    });
}
self.withdraw = function(currency,quantity,address,paymentId){
    return new Promise(function(resolve, reject){
        var params = {apikey:self.apiKey,nonce:Math.floor(new Date().getTime() * 1000),currency:currency,quantity:quantity,address:address,paymentid:paymentId};
        self.apiCall("withdraw",params).then(function(data){
            resolve(data.result);
        },function(err){
            reject(err);
        });
    });
}
self.getOrder = function(orderId){
    return new Promise(function(resolve, reject){
        var params = {apikey:self.apiKey,nonce:Math.floor(new Date().getTime() * 1000),uuid:orderId}
        self.apiCall("getorder",params).then(function(data){
            resolve(data.result);
        },function(err){
            reject(err);
        });
    });
}
self.getOrderHistory = function(market = null){
    return new Promise(function(resolve, reject){
        var params = {apikey:self.apiKey,nonce:Math.floor(new Date().getTime() * 1000)};
        if(market !== null){
            params.market = market;
        }
        self.apiCall("getorderhistory",params).then(function(data){
            resolve(data.result);
        },function(err){
            reject(err);
        });
    });
}
self.getWithdrawalHistory = function(currency = null){
    return new Promise(function(resolve, reject){
        var params = {apikey:self.apiKey,nonce:Math.floor(new Date().getTime() * 1000)};
        if(currency !== null){
            params.currency = currency;
        }
        self.apiCall("getwithdrawalhistory",params).then(function(data){
            resolve(data.result);
        },function(err){
            reject(err);
        });
    });
}
self.getDepositHistory = function(currency = null){
    return new Promise(function(resolve, reject){
        var params = {apikey:self.apiKey,nonce:Math.floor(new Date().getTime() * 1000)};
        if(currency !== null){
            params.currency = currency;
        }
        self.apiCall("getdeposithistory",params).then(function(data){
            resolve(data.result);
        },function(err){
            reject(err);
        });

    });
}
self.buyLimit = function(quantity,market,rate){
    return new Promise(function(resolve, reject){
        var params = {apikey:self.apiKey,nonce:Math.floor(new Date().getTime() * 1000)};
        params.quantity = quantity;
        params.market = market;
        params.rate = rate;
        self.apiCall("buylimit",params).then(function(data){
            resolve(data.result);
        },function(err){
            reject(err);
        });
    });
}
self.sellLimit = function(quantity,market,rate){
    return new Promise(function(resolve, reject){
        var params = {apikey:self.apiKey,nonce:Math.floor(new Date().getTime() * 1000)};
        params.quantity = quantity;
        params.market = market;
        params.rate = rate;
        self.apiCall("selllimit",params).then(function(data){
            resolve(data.result);
        },function(err){
            reject(err);
        });
    });
}
self.cancel = function(orderId){
    return new Promise(function(resolve, reject){
        var params = {apikey:self.apiKey,nonce:Math.floor(new Date().getTime() * 1000)};
        params.uuid = orderId;
        self.apiCall("cancel",params).then(function(data){
            resolve(data.result);
        },function(err){
            reject(err);
        });
    });
}
self.getOpenOrders = function(market = null){
    return new Promise(function(resolve, reject){
        var params = {apikey:self.apiKey,nonce:Math.floor(new Date().getTime() * 1000)};
        if(market !== null){
            params.market = market;
        }
        self.apiCall("getopenorders",params).then(function(data){
            resolve(data.result);
        },function(err){
            reject(err);
        });
    });
}

module.exports = self;