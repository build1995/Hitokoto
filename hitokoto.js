
"use strict";


var dappAddress = "n1p3kCva144dxq5qmzcxqvDXBcKkNA44YAY";


var nebulas = require("nebulas"),
	Account = nebulas.Account,
	neb = new nebulas.Neb();
neb.setRequest(new nebulas.HttpRequest("https://mainnet.nebulas.io"));

function addEvent(ele,type,callback){
	if(ele.addEventListener){
		ele.addEventListener(type,callback,false);
	}else if(ele.attachEvent){
		ele.attachEvent('on'+type,callback);
	}else{
		ele['on'+type]=callback;
	}
}
window.onload=function () {
	var gethi;
	var body = document.querySelector('body');
	var updatehi = document.querySelector('.sub');
	var addhi = document.querySelector('.add');
	var time_progress = document.querySelector('.progress-time');
	var hitokoto = document.querySelector('.hitokoto');
	var from = document.querySelector('.from');
	var queue = [];
	var times = new Date().getTime();
	update();
	setcolor();
	time_update()
	function update() {

		var Addrfrom = Account.NewAccount().getAddressString();
		var value = "0";
		var nonce = "0"
		var gas_price = "1000000"
		var gas_limit = "2000000"
		var callFunction = "len";
		var contract = {
			"function": callFunction,
			"args": ""
		}
		neb.api.call(Addrfrom,dappAddress,value,nonce,gas_price,gas_limit,contract).then(function (resp) {
			console.log("return of rpc call: " + JSON.stringify(resp))
			var len = resp.result;
			console.log(len);
			var callFunction = "get";
			var key = Math.floor(Math.random()*len);
			var callArgs = "[\""+key+"\"]"; //in the form of ["args"]
			var contract = {
				"function": callFunction,
				"args": callArgs
			}

			neb.api.call(Addrfrom,dappAddress,value,nonce,gas_price,gas_limit,contract).then(function (resp) {
				console.log("return of rpc call: " + JSON.stringify(resp))
				var result = JSON.parse(resp.result);
				hitokoto.innerHTML = result.word;
				from.innerHTML = "- "+ result.from;
				console.log(len);

			}).catch(function (err) {
				//cbSearch(err)
				console.log("error:" + err.message)
			})



		}).catch(function (err) {
			//cbSearch(err)
			console.log("error:" + err.message)
		})

		
	}
	function setcolor() {
		body.style.background=body.style.color=updatehi.style.background=addhi.style.background=time_progress.style.background=color();
	}
	function color() {
		return "rgb("+random()+","+random()+","+random()+")";
	}
	function random() {
		return Math.floor(Math.random()*(81)+60)
	}
	function time_update(){
		console.log(queue);
		queue[queue.length] = setInterval(function(){
			time_progress.style.left=time_progress.style.left=="0%"?"100%":"0%";
			update();
			setcolor();
			console.log((new Date().getTime()-times)/1000);
			times = new Date().getTime();
			},12000);
	}
	addEvent(updatehi,'click',function(){
		$("#Add").removeClass("hide");
		for (var i = 0; i < queue.length; i++) {
			clearInterval(queue[i]);
		}
		queue=[];
		console.log(queue);
		update();
		time_update();

	})
	addEvent(addhi,'click',function(){
		console.log($("#word").val());
		add() ;
		$("#Add").addClass("hide");
		for (var i = 0; i < queue.length; i++) {
			clearInterval(queue[i]);
		}
		queue=[];
		console.log(queue);
		update();
		time_update();
	})
	setTimeout(function(){
		time_progress.style.left = ""||"100%";
	},200)
}



var serialNumber
var intervalQuery

var NebPay = require("nebpay");     //https://github.com/nebulasio/nebPay
var nebPay = new NebPay();

function add() {
	var to = dappAddress;
	var value = "0";
	var callFunction = "save"
	var callArgs = "[\"" + $("#word").val() + "\",\"" + $("#from").val() + "\"]"
	
	serialNumber = nebPay.call(to, value, callFunction, callArgs, {    //使用nebpay的call接口去调用合约,
		listener: cbPush        //设置listener, 处理交易返回信息
	});
	console.log(callArgs);
	intervalQuery = setInterval(function () {
		funcIntervalQuery();
	}, 5000);
}


function funcIntervalQuery() {
	nebPay.queryPayInfo(serialNumber)   //search transaction result from server (result upload to server by app)
		.then(function (resp) {
			console.log("tx result: " + resp)   //resp is a JSON string
			var respObject = JSON.parse(resp)
			if(respObject.code === 0){
				alert(`添加一言成功!`)
				clearInterval(intervalQuery)
			}
		})
		.catch(function (err) {
			console.log(err);
		});
}

function cbPush(resp) {
	console.log("response of push: " + JSON.stringify(resp))
}
