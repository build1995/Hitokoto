"use strict";

var Hitokoto = function(text) {
	if (text) {
		var obj = JSON.parse(text);
		this.word = obj.word;
		this.from = obj.from;
		this.author = obj.author;
	} else {
	    this.word = "";
	    this.author = "";
	    this.from = "";
	}
};

Hitokoto.prototype = {
	toString: function () {
		return JSON.stringify(this);
	}
};

var TheHitokoto = function () {
    LocalContractStorage.defineMapProperty(this, "repo", {
        parse: function (text) {
            return new Hitokoto(text);
        },
        stringify: function (o) {
            return o.toString();
        }
    });
    LocalContractStorage.defineProperty(this, "size");
};

TheHitokoto.prototype = {
    init: function () {
        this.size = 0;
        // todo
    },

    save: function (word, value) {

        word = word.trim();
        value = value.trim();
        if (word === "" || value === ""){
            throw new Error("empty word / value");
        }
        if (value.length > 64 || word.length > 64){
            throw new Error("word / value exceed limit length")
        }

        var from = Blockchain.transaction.from;
        
        var hitokoto = new Hitokoto();
        hitokoto.author = from;
        hitokoto.word = word;
        hitokoto.from = value;

        this.repo.put(this.size, hitokoto);
        this.size +=1;
    },

    get: function (key) {
        key = key.trim();
        if ( key === "" ) {
            throw new Error("empty key")
        }
        return this.repo.get(key);
    },

    len:function(){
        return this.size;
    }

};
module.exports = TheHitokoto;