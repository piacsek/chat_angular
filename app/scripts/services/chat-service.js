angular.module('chatApp').service('ChatService',  function(HTTPService, CallbackUtils){

	var currentConversationId = null;

	var messagesReceivedCallback = null;

	var conversationsReceivedCallback = null;

	this.setCurrentConversationId = function (id){
		currentConversationId = id;
	};

	this.setMessagesReceivedCallback = function (callback){
		messagesReceivedCallback = callback;
	};

	this.setConversationsReceivedCallback = function (callback){
		conversationsReceivedCallback = callback;
	};

	var loadMessages = function(){
		var endpoint = "/conversations/" + currentConversationId + "/";
	    HTTPService.requests(endpoint).get().$promise.then(function(response) {
	    	messagesReceivedCallback(response)
	    }, function(promise) {
	        CallbackUtils.mostrarErros(promise);
	    });
	};

	var loadConversationsList = function(){
		var endpoint = "/conversations/all";
	    HTTPService.requests(endpoint).get().$promise.then(function(response) {
	    	conversationsReceivedCallback(response)
	    }, function(promise) {
	        CallbackUtils.mostrarErros(promise);
	    });
	};

});